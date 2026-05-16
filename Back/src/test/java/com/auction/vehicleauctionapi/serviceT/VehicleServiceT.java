package com.auction.vehicleauctionapi.serviceT;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.auction.vehicleauctionapi.mapper.VehicleMapper;
import com.auction.vehicleauctionapi.model.dto.request.VehicleReqDTO;
import com.auction.vehicleauctionapi.model.dto.response.VehicleRespDTO;
import com.auction.vehicleauctionapi.model.entity.VehicleEntity;
import com.auction.vehicleauctionapi.repository.VehicleRepository;
import com.auction.vehicleauctionapi.service.impl.VehicleServiceImpl;

import jakarta.persistence.EntityNotFoundException;

@ExtendWith(MockitoExtension.class)
@DisplayName("VehicleService — Unit Tests")
class VehicleServiceT {

    @Mock
    private VehicleRepository vehicleRepository;
    @Mock
    private VehicleMapper vehicleMapper;

    @InjectMocks
    private VehicleServiceImpl vehicleService;

    private VehicleEntity vehicleEntity;
    private VehicleReqDTO vehicleReqDTO;
    private VehicleRespDTO vehicleRespDTO;

    @BeforeEach
    void setUp() {
        vehicleEntity = VehicleEntity.builder()
                .vin("1HGCM82633A004352")
                .year(2020)
                .make("Honda")
                .model("Accord")
                .trim("Sport")
                .body("Sedan")
                .transmission("Automatic")
                .state("Disponible")
                .condition(45)
                .odometer(35000)
                .color("White")
                .interior("Black")
                .build();

        vehicleReqDTO = VehicleReqDTO.builder()
                .vin("1HGCM82633A004352")
                .year(2020)
                .make("Honda")
                .model("Accord")
                .trim("Sport")
                .body("Sedan")
                .transmission("Automatic")
                .state("Disponible")
                .condition(45)
                .odometer(35000)
                .color("White")
                .interior("Black")
                .build();

        vehicleRespDTO = new VehicleRespDTO();
        vehicleRespDTO.setVin("1HGCM82633A004352");
        vehicleRespDTO.setYear(2020);
        vehicleRespDTO.setMake("Honda");
        vehicleRespDTO.setModel("Accord");
        vehicleRespDTO.setTrim("Sport");
        vehicleRespDTO.setBody("Sedan");
        vehicleRespDTO.setTransmission("Automatic");
        vehicleRespDTO.setState("Disponible");
        vehicleRespDTO.setCondition(45);
        vehicleRespDTO.setOdometer(35000);
        vehicleRespDTO.setColor("White");
        vehicleRespDTO.setInterior("Black");
    }

    // ── CREATE ───────────────────────────────────────────────

    @Nested
    @DisplayName("create()")
    class CreateTests {

        @Test
        @DisplayName("Debería crear un vehículo correctamente y retornar el DTO de respuesta")
        void create_validDto_returnsVehicleRespDTO() {
            when(vehicleRepository.existsByVin("1HGCM82633A004352")).thenReturn(false);
            when(vehicleMapper.toEntity(vehicleReqDTO)).thenReturn(vehicleEntity);
            when(vehicleRepository.save(any(VehicleEntity.class))).thenReturn(vehicleEntity);
            when(vehicleMapper.toResponseDTO(vehicleEntity)).thenReturn(vehicleRespDTO);

            VehicleRespDTO result = vehicleService.create(vehicleReqDTO);

            assertThat(result).isNotNull();
            assertThat(result.getVin()).isEqualTo("1HGCM82633A004352");
            assertThat(result.getMake()).isEqualTo("Honda");
            assertThat(result.getModel()).isEqualTo("Accord");
        }

        @Test
        @DisplayName("Debería lanzar IllegalArgumentException cuando el VIN ya existe")
        void create_duplicateVin_throwsIllegalArgumentException() {
            when(vehicleRepository.existsByVin("1HGCM82633A004352")).thenReturn(true);

            assertThatThrownBy(() -> vehicleService.create(vehicleReqDTO))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("already exists");
        }

        @Test
        @DisplayName("Debería limpiar los espacios del VIN antes de validar duplicados")
        void create_trimVinWithSpaces_usesTrimedVin() {
            vehicleReqDTO.setVin("  1HGCM82633A004352  ");
            when(vehicleRepository.existsByVin("1HGCM82633A004352")).thenReturn(false);
            when(vehicleMapper.toEntity(vehicleReqDTO)).thenReturn(vehicleEntity);
            when(vehicleRepository.save(any(VehicleEntity.class))).thenReturn(vehicleEntity);
            when(vehicleMapper.toResponseDTO(vehicleEntity)).thenReturn(vehicleRespDTO);

            VehicleRespDTO result = vehicleService.create(vehicleReqDTO);

            assertThat(result).isNotNull();
            verify(vehicleRepository).existsByVin("1HGCM82633A004352");
        }
    }

    // ── GET BY VIN ───────────────────────────────────────────

    @Nested
    @DisplayName("getByVin()")
    class GetByVinTests {

        @Test
        @DisplayName("Debería retornar el vehículo cuando el VIN existe")
        void getByVin_existingVin_returnsVehicleRespDTO() {
            when(vehicleRepository.findById("1HGCM82633A004352")).thenReturn(Optional.of(vehicleEntity));
            when(vehicleMapper.toResponseDTO(vehicleEntity)).thenReturn(vehicleRespDTO);

            VehicleRespDTO result = vehicleService.getByVin("1HGCM82633A004352");

            assertThat(result).isNotNull();
            assertThat(result.getVin()).isEqualTo("1HGCM82633A004352");
        }

        @Test
        @DisplayName("Debería lanzar EntityNotFoundException cuando el VIN no existe")
        void getByVin_nonExistingVin_throwsEntityNotFoundException() {
            when(vehicleRepository.findById("VIN_FAKE")).thenReturn(Optional.empty());

            assertThatThrownBy(() -> vehicleService.getByVin("VIN_FAKE"))
                    .isInstanceOf(EntityNotFoundException.class);
        }
    }

    // ── LIST ─────────────────────────────────────────────────

    @Nested
    @DisplayName("list()")
    class ListTests {

        @Test
        @DisplayName("Debería retornar todos los vehículos registrados")
        void list_returnsAllVehicles() {
            VehicleEntity second = VehicleEntity.builder()
                    .vin("5YJSA1E26MF123456").year(2022).make("Tesla").model("Model 3").build();

            VehicleRespDTO secondResp = new VehicleRespDTO();
            secondResp.setVin("5YJSA1E26MF123456");
            secondResp.setMake("Tesla");

            when(vehicleRepository.findAll()).thenReturn(List.of(vehicleEntity, second));
            when(vehicleMapper.toResponseDTO(vehicleEntity)).thenReturn(vehicleRespDTO);
            when(vehicleMapper.toResponseDTO(second)).thenReturn(secondResp);

            List<VehicleRespDTO> result = vehicleService.list();

            assertThat(result).hasSize(2);
            assertThat(result.get(0).getMake()).isEqualTo("Honda");
            assertThat(result.get(1).getMake()).isEqualTo("Tesla");
        }

        @Test
        @DisplayName("Debería retornar lista vacía cuando no hay vehículos")
        void list_emptyRepository_returnsEmptyList() {
            when(vehicleRepository.findAll()).thenReturn(Collections.emptyList());

            List<VehicleRespDTO> result = vehicleService.list();

            assertThat(result).isEmpty();
        }
    }

    // ── DELETE ────────────────────────────────────────────────

    @Nested
    @DisplayName("deleteByVin()")
    class DeleteTests {

        @Test
        @DisplayName("Debería invocar deleteById del repositorio con el VIN correcto")
        void deleteByVin_callsRepositoryDeleteById() {
            vehicleService.deleteByVin("1HGCM82633A004352");

            verify(vehicleRepository).deleteById("1HGCM82633A004352");
        }
    }

    // ── UPDATE ───────────────────────────────────────────────

    @Nested
    @DisplayName("updateVehicle()")
    class UpdateTests {

        @Test
        @DisplayName("Debería actualizar el vehículo y retornar el DTO actualizado")
        void updateVehicle_existingVin_returnsUpdatedDTO() {
            when(vehicleRepository.findById("1HGCM82633A004352")).thenReturn(Optional.of(vehicleEntity));
            when(vehicleRepository.save(any(VehicleEntity.class))).thenReturn(vehicleEntity);
            when(vehicleMapper.toResponseDTO(vehicleEntity)).thenReturn(vehicleRespDTO);

            VehicleRespDTO result = vehicleService.updateVehicle("1HGCM82633A004352", vehicleReqDTO);

            assertThat(result).isNotNull();
            assertThat(result.getVin()).isEqualTo("1HGCM82633A004352");
            verify(vehicleMapper).updateEntityFromDTO(vehicleReqDTO, vehicleEntity);
        }

        @Test
        @DisplayName("Debería lanzar EntityNotFoundException cuando el VIN a actualizar no existe")
        void updateVehicle_nonExistingVin_throwsEntityNotFoundException() {
            when(vehicleRepository.findById("VIN_FAKE")).thenReturn(Optional.empty());

            assertThatThrownBy(() -> vehicleService.updateVehicle("VIN_FAKE", vehicleReqDTO))
                    .isInstanceOf(EntityNotFoundException.class)
                    .hasMessageContaining("VIN_FAKE");
        }
    }
}
