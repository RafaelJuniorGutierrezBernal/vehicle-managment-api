package com.auction.vehicleauctionapi.repositoyT;

import static org.assertj.core.api.Assertions.assertThat;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import com.auction.vehicleauctionapi.model.entity.SaleEntity;
import com.auction.vehicleauctionapi.model.entity.VehicleEntity;
import com.auction.vehicleauctionapi.repository.SaleRepository;
import com.auction.vehicleauctionapi.repository.VehicleRepository;

@DataJpaTest
@ActiveProfiles("test")
@DisplayName("VehicleRepository — Integration Tests")
class VehicleRepositoryTest {

    @Autowired
    private VehicleRepository vehicleRepository;
    @Autowired
    private SaleRepository saleRepository;

    @BeforeEach
    void setUp() {
        saleRepository.deleteAll();
        vehicleRepository.deleteAll();
    }

    private VehicleEntity buildVehicle(String vin, String make, String model) {
        return VehicleEntity.builder()
                .vin(vin)
                .year(2020)
                .make(make)
                .model(model)
                .trim("Sport")
                .body("Sedan")
                .transmission("Automatic")
                .state("Disponible")
                .condition(45)
                .odometer(35000)
                .color("White")
                .interior("Black")
                .build();
    }

    @Test
    @DisplayName("Debería guardar un vehículo y recuperarlo por VIN con todos sus campos")
    void saveAndFindById_returnsVehicle() {
        VehicleEntity vehicle = buildVehicle("1HGCM82633A004352", "Honda", "Accord");
        vehicleRepository.save(vehicle);

        Optional<VehicleEntity> found = vehicleRepository.findById("1HGCM82633A004352");

        assertThat(found).isPresent();
        assertThat(found.get().getVin()).isEqualTo("1HGCM82633A004352");
        assertThat(found.get().getMake()).isEqualTo("Honda");
        assertThat(found.get().getModel()).isEqualTo("Accord");
        assertThat(found.get().getYear()).isEqualTo(2020);
        assertThat(found.get().getCondition()).isEqualTo(45);
        assertThat(found.get().getOdometer()).isEqualTo(35000);
    }

    @Test
    @DisplayName("Debería retornar vacío cuando se busca por un VIN que no existe")
    void findById_nonExisting_returnsEmpty() {
        Optional<VehicleEntity> found = vehicleRepository.findById("VIN_INEXISTENTE");

        assertThat(found).isEmpty();
    }

    @Test
    @DisplayName("Debería retornar true cuando el VIN ya existe en la base de datos")
    void existsByVin_existingVin_returnsTrue() {
        vehicleRepository.save(buildVehicle("1HGCM82633A004352", "Honda", "Accord"));

        boolean exists = vehicleRepository.existsByVin("1HGCM82633A004352");

        assertThat(exists).isTrue();
    }

    @Test
    @DisplayName("Debería retornar false cuando el VIN no existe en la base de datos")
    void existsByVin_nonExistingVin_returnsFalse() {
        boolean exists = vehicleRepository.existsByVin("VIN_INEXISTENTE");

        assertThat(exists).isFalse();
    }

    @Test
    @DisplayName("Debería eliminar un vehículo por su VIN")
    void deleteById_removesVehicle() {
        vehicleRepository.save(buildVehicle("1HGCM82633A004352", "Honda", "Accord"));

        vehicleRepository.deleteById("1HGCM82633A004352");

        assertThat(vehicleRepository.findById("1HGCM82633A004352")).isEmpty();
    }

    @Test
    @DisplayName("Debería retornar todos los vehículos guardados")
    void findAll_returnsAllVehicles() {
        vehicleRepository.save(buildVehicle("1HGCM82633A004352", "Honda", "Accord"));
        vehicleRepository.save(buildVehicle("5YJSA1E26MF123456", "Tesla", "Model 3"));
        vehicleRepository.save(buildVehicle("WBAJB0C51JB084264", "BMW", "530i"));

        List<VehicleEntity> vehicles = vehicleRepository.findAll();

        assertThat(vehicles).hasSize(3);
    }

    @Test
    @DisplayName("Debería persistir las ventas asociadas al vehículo en la relación OneToMany")
    void save_vehicleWithSales_persistsRelationship() {
        VehicleEntity vehicle = buildVehicle("1HGCM82633A004352", "Honda", "Accord");
        vehicleRepository.saveAndFlush(vehicle);

        SaleEntity sale = SaleEntity.builder()
                .seller("Carlos")
                .mmr(new BigDecimal("12000.00"))
                .sellingPrice(new BigDecimal("15000.00"))
                .saleDate(LocalDate.of(2026, 3, 10))
                .vehicle(vehicle)
                .build();
        saleRepository.saveAndFlush(sale);

        // Verifico que la venta existe y está vinculada al vehículo
        assertThat(saleRepository.findAll()).hasSize(1);
        SaleEntity found = saleRepository.findAll().get(0);
        assertThat(found.getVehicle().getVin()).isEqualTo("1HGCM82633A004352");

        // Al eliminar la venta directamente, el vehículo debe seguir existiendo
        saleRepository.deleteAll();
        saleRepository.flush();

        assertThat(saleRepository.findAll()).isEmpty();
        assertThat(vehicleRepository.findById("1HGCM82633A004352")).isPresent();
    }
}