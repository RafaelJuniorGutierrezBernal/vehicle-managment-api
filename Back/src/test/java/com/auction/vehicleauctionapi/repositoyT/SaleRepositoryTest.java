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
@DisplayName("SaleRepository — Integration Tests")
class SaleRepositoryTest {

    @Autowired
    private SaleRepository saleRepository;
    @Autowired
    private VehicleRepository vehicleRepository;

    private VehicleEntity vehicle;

    @BeforeEach
    void setUp() {
        saleRepository.deleteAll();
        vehicleRepository.deleteAll();

        vehicle = VehicleEntity.builder()
                .vin("1HGCM82633A004352")
                .year(2020)
                .make("Honda")
                .model("Accord")
                .build();
        vehicleRepository.save(vehicle);
    }

    private SaleEntity buildSale(String seller, String price, LocalDate date) {
        return SaleEntity.builder()
                .seller(seller)
                .mmr(new BigDecimal("12000.00"))
                .sellingPrice(new BigDecimal(price))
                .saleDate(date)
                .vehicle(vehicle)
                .build();
    }

    @Test
    @DisplayName("Debería guardar una venta y recuperarla por ID con todos sus campos")
    void saveAndFindById_returnsSavedSale() {
        SaleEntity sale = buildSale("Carlos", "15000.00", LocalDate.of(2026, 3, 10));
        SaleEntity saved = saleRepository.save(sale);

        Optional<SaleEntity> found = saleRepository.findById(saved.getId());

        assertThat(found).isPresent();
        assertThat(found.get().getSeller()).isEqualTo("Carlos");
        assertThat(found.get().getSellingPrice()).isEqualByComparingTo(new BigDecimal("15000.00"));
        assertThat(found.get().getVehicle().getVin()).isEqualTo("1HGCM82633A004352");
    }

    @Test
    @DisplayName("Debería verificar que todos los campos se persisten correctamente")
    void save_verifiesAllFieldsPersisted() {
        SaleEntity sale = buildSale("Ana", "18500.50", LocalDate.of(2026, 5, 1));
        SaleEntity saved = saleRepository.save(sale);

        SaleEntity found = saleRepository.findById(saved.getId()).orElseThrow();

        assertThat(found.getId()).isNotNull();
        assertThat(found.getSeller()).isEqualTo("Ana");
        assertThat(found.getMmr()).isEqualByComparingTo(new BigDecimal("12000.00"));
        assertThat(found.getSellingPrice()).isEqualByComparingTo(new BigDecimal("18500.50"));
        assertThat(found.getSaleDate()).isEqualTo(LocalDate.of(2026, 5, 1));
    }

    @Test
    @DisplayName("Debería retornar vacío cuando se busca por un ID que no existe")
    void findById_nonExisting_returnsEmpty() {
        Optional<SaleEntity> found = saleRepository.findById(9999L);

        assertThat(found).isEmpty();
    }

    @Test
    @DisplayName("Debería eliminar una venta existente por su ID")
    void deleteById_removesSale() {
        SaleEntity saved = saleRepository.save(buildSale("Carlos", "15000.00", LocalDate.now()));

        saleRepository.deleteById(saved.getId());

        assertThat(saleRepository.findById(saved.getId())).isEmpty();
    }

    @Test
    @DisplayName("Debería retornar todas las ventas guardadas")
    void findAll_returnsAllSales() {
        saleRepository.save(buildSale("Carlos", "15000.00", LocalDate.of(2026, 1, 1)));
        saleRepository.save(buildSale("Ana", "18000.00", LocalDate.of(2026, 2, 1)));
        saleRepository.save(buildSale("Luis", "22000.00", LocalDate.of(2026, 3, 1)));

        List<SaleEntity> sales = saleRepository.findAll();

        assertThat(sales).hasSize(3);
    }

    @Test
    @DisplayName("Debería asignar la fecha actual con @PrePersist cuando saleDate es null")
    void save_withoutSaleDate_prePeristSetsDate() {
        SaleEntity sale = SaleEntity.builder()
                .seller("Pedro")
                .mmr(new BigDecimal("10000.00"))
                .sellingPrice(new BigDecimal("11000.00"))
                .vehicle(vehicle)
                .build();
        // saleDate queda null intencionalmente

        SaleEntity saved = saleRepository.save(sale);

        assertThat(saved.getSaleDate()).isNotNull();
        assertThat(saved.getSaleDate()).isEqualTo(LocalDate.now());
    }

    @Test
    @DisplayName("Debería actualizar un campo de una venta existente")
    void update_modifiesExistingEntity() {
        SaleEntity saved = saleRepository.save(buildSale("Carlos", "15000.00", LocalDate.now()));

        saved.setSeller("Carlos Updated");
        saved.setSellingPrice(new BigDecimal("17000.00"));
        saleRepository.save(saved);

        SaleEntity updated = saleRepository.findById(saved.getId()).orElseThrow();

        assertThat(updated.getSeller()).isEqualTo("Carlos Updated");
        assertThat(updated.getSellingPrice()).isEqualByComparingTo(new BigDecimal("17000.00"));
    }
}
