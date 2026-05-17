package com.auction.vehicleauctionapi.serviceT;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDate;
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

import com.auction.vehicleauctionapi.mapper.SaleMapper;
import com.auction.vehicleauctionapi.model.dto.request.SaleReqDTO;
import com.auction.vehicleauctionapi.model.dto.response.SaleRespDTO;
import com.auction.vehicleauctionapi.model.dto.response.VehicleRespDTO;
import com.auction.vehicleauctionapi.model.entity.SaleEntity;
import com.auction.vehicleauctionapi.model.entity.VehicleEntity;
import com.auction.vehicleauctionapi.repository.SaleRepository;
import com.auction.vehicleauctionapi.repository.VehicleRepository;
import com.auction.vehicleauctionapi.service.impl.SaleServiceImpl;

import jakarta.persistence.EntityNotFoundException;

@ExtendWith(MockitoExtension.class)
@DisplayName("SaleService — Unit Tests")
class SaleServiceT {

    @Mock
    private SaleRepository saleRepository;
    @Mock
    private VehicleRepository vehicleRepository;
    @Mock
    private SaleMapper saleMapper;

    @InjectMocks
    private SaleServiceImpl saleService;

    private VehicleEntity vehicleEntity;
    private SaleEntity saleEntity;
    private SaleReqDTO saleReqDTO;
    private SaleRespDTO saleRespDTO;

    @BeforeEach
    void setUp() {
        vehicleEntity = VehicleEntity.builder()
                .vin("1HGCM82633A004352")
                .year(2020)
                .make("Honda")
                .model("Accord")
                .state("Disponible")
                .build();

        saleEntity = SaleEntity.builder()
                .id(1L)
                .seller("Carlos")
                .mmr(new BigDecimal("15000.00"))
                .sellingPrice(new BigDecimal("16500.00"))
                .saleDate(LocalDate.of(2026, 3, 15))
                .vehicle(vehicleEntity)
                .build();

        saleReqDTO = SaleReqDTO.builder()
                .seller("Carlos")
                .mmr(new BigDecimal("15000.00"))
                .sellingPrice(new BigDecimal("16500.00"))
                .saleDate(LocalDate.of(2026, 3, 15))
                .vehicleVin("1HGCM82633A004352")
                .build();

        saleRespDTO = new SaleRespDTO();
        saleRespDTO.setId(1L);
        saleRespDTO.setSeller("Carlos");
        saleRespDTO.setMmr(new BigDecimal("15000.00"));
        saleRespDTO.setSellingPrice(new BigDecimal("16500.00"));
        saleRespDTO.setSaleDate(LocalDate.of(2026, 3, 15));
        VehicleRespDTO vehicleResp = new VehicleRespDTO();
        vehicleResp.setVin("1HGCM82633A004352");
        saleRespDTO.setVehicle(vehicleResp);
    }

    // ── CREATE ───────────────────────────────────────────────

    @Nested
    @DisplayName("create()")
    class CreateTests {

        @Test
        @DisplayName("Debería crear una venta correctamente y retornar el DTO de respuesta")
        void create_validDto_returnsSaleRespDTO() {
            when(vehicleRepository.findById("1HGCM82633A004352")).thenReturn(Optional.of(vehicleEntity));
            when(saleMapper.toEntity(saleReqDTO)).thenReturn(saleEntity);
            when(saleRepository.save(any(SaleEntity.class))).thenReturn(saleEntity);
            when(saleMapper.toResponseDTO(saleEntity)).thenReturn(saleRespDTO);

            SaleRespDTO result = saleService.create(saleReqDTO);

            assertThat(result).isNotNull();
            assertThat(result.getId()).isEqualTo(1L);
            assertThat(result.getSeller()).isEqualTo("Carlos");
            assertThat(result.getVehicle().getVin()).isEqualTo("1HGCM82633A004352");
        }

        @Test
        @DisplayName("Debería lanzar EntityNotFoundException cuando el vehículo no existe")
        void create_vehicleNotFound_throwsEntityNotFoundException() {
            when(vehicleRepository.findById("1HGCM82633A004352")).thenReturn(Optional.empty());

            assertThatThrownBy(() -> saleService.create(saleReqDTO))
                    .isInstanceOf(EntityNotFoundException.class)
                    .hasMessageContaining("1HGCM82633A004352");
        }

        @Test
        @DisplayName("Debería cambiar el estado del vehículo a 'Vendido' al crear la venta")
        void create_verifiesVehicleStateSetToVendido() {
            when(vehicleRepository.findById("1HGCM82633A004352")).thenReturn(Optional.of(vehicleEntity));
            when(saleMapper.toEntity(saleReqDTO)).thenReturn(saleEntity);
            when(saleRepository.save(any(SaleEntity.class))).thenReturn(saleEntity);
            when(saleMapper.toResponseDTO(saleEntity)).thenReturn(saleRespDTO);

            saleService.create(saleReqDTO);

            assertThat(vehicleEntity.getState()).isEqualTo("Vendido");
            verify(vehicleRepository).save(vehicleEntity);
        }

        @Test
        @DisplayName("Debería limpiar los espacios del VIN antes de buscar el vehículo")
        void create_trimVinWithSpaces_usesTrimedVin() {
            saleReqDTO.setVehicleVin("  1HGCM82633A004352  ");
            when(vehicleRepository.findById("1HGCM82633A004352")).thenReturn(Optional.of(vehicleEntity));
            when(saleMapper.toEntity(saleReqDTO)).thenReturn(saleEntity);
            when(saleRepository.save(any(SaleEntity.class))).thenReturn(saleEntity);
            when(saleMapper.toResponseDTO(saleEntity)).thenReturn(saleRespDTO);

            SaleRespDTO result = saleService.create(saleReqDTO);

            assertThat(result).isNotNull();
            verify(vehicleRepository).findById("1HGCM82633A004352");
        }
    }

    // ── GET BY ID ────────────────────────────────────────────

    @Nested
    @DisplayName("getById()")
    class GetByIdTests {

        @Test
        @DisplayName("Debería retornar la venta cuando el ID existe")
        void getById_existingId_returnsSaleRespDTO() {
            when(saleRepository.findById(1L)).thenReturn(Optional.of(saleEntity));
            when(saleMapper.toResponseDTO(saleEntity)).thenReturn(saleRespDTO);

            SaleRespDTO result = saleService.getById(1L);

            assertThat(result).isNotNull();
            assertThat(result.getId()).isEqualTo(1L);
        }

        @Test
        @DisplayName("Debería lanzar EntityNotFoundException cuando el ID no existe")
        void getById_nonExistingId_throwsEntityNotFoundException() {
            when(saleRepository.findById(999L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> saleService.getById(999L))
                    .isInstanceOf(EntityNotFoundException.class);
        }
    }

    // ── LIST ─────────────────────────────────────────────────

    @Nested
    @DisplayName("list()")
    class ListTests {

        @Test
        @DisplayName("Debería retornar todas las ventas registradas")
        void list_returnsAllSales() {
            SaleEntity secondSale = SaleEntity.builder()
                    .id(2L).seller("Ana")
                    .sellingPrice(new BigDecimal("20000.00"))
                    .saleDate(LocalDate.now())
                    .vehicle(vehicleEntity)
                    .build();

            SaleRespDTO secondResp = new SaleRespDTO();
            secondResp.setId(2L);
            secondResp.setSeller("Ana");

            when(saleRepository.findAll()).thenReturn(List.of(saleEntity, secondSale));
            when(saleMapper.toResponseDTO(saleEntity)).thenReturn(saleRespDTO);
            when(saleMapper.toResponseDTO(secondSale)).thenReturn(secondResp);

            List<SaleRespDTO> result = saleService.list();

            assertThat(result).hasSize(2);
            assertThat(result.get(0).getSeller()).isEqualTo("Carlos");
            assertThat(result.get(1).getSeller()).isEqualTo("Ana");
        }

        @Test
        @DisplayName("Debería retornar lista vacía cuando no hay ventas")
        void list_emptyRepository_returnsEmptyList() {
            when(saleRepository.findAll()).thenReturn(Collections.emptyList());

            List<SaleRespDTO> result = saleService.list();

            assertThat(result).isEmpty();
        }
    }

    // ── DELETE ────────────────────────────────────────────────

    @Nested
    @DisplayName("deleteById()")
    class DeleteTests {

        @Test
        @DisplayName("Debería invocar deleteById del repositorio con el ID correcto")
        void deleteById_callsRepositoryDeleteById() {
            saleService.deleteById(1L);

            verify(saleRepository).deleteById(1L);
        }
    }

    // ── UPDATE ───────────────────────────────────────────────

    @Nested
    @DisplayName("updateSale()")
    class UpdateTests {

        @Test
        @DisplayName("Debería actualizar la venta sin cambiar el vehículo cuando el VIN es el mismo")
        void updateSale_existingId_sameVehicle_returnsUpdatedSale() {
            when(saleRepository.findById(1L)).thenReturn(Optional.of(saleEntity));
            when(saleRepository.save(any(SaleEntity.class))).thenReturn(saleEntity);
            when(saleMapper.toResponseDTO(saleEntity)).thenReturn(saleRespDTO);

            SaleRespDTO result = saleService.updateSale(1L, saleReqDTO);

            assertThat(result).isNotNull();
            assertThat(result.getId()).isEqualTo(1L);
            verify(saleMapper).updateEntityFromDTO(saleReqDTO, saleEntity);
        }

        @Test
        @DisplayName("Debería cambiar el vehículo cuando el VIN del DTO es diferente al existente")
        void updateSale_existingId_differentVehicle_changesVehicle() {
            VehicleEntity newVehicle = VehicleEntity.builder()
                    .vin("5YJSA1E26MF123456")
                    .year(2022)
                    .make("Tesla")
                    .build();

            SaleReqDTO updateDTO = SaleReqDTO.builder()
                    .seller("Carlos")
                    .sellingPrice(new BigDecimal("16500.00"))
                    .saleDate(LocalDate.of(2026, 3, 15))
                    .vehicleVin("5YJSA1E26MF123456")
                    .build();

            when(saleRepository.findById(1L)).thenReturn(Optional.of(saleEntity));
            when(vehicleRepository.findById("5YJSA1E26MF123456")).thenReturn(Optional.of(newVehicle));
            when(saleRepository.save(any(SaleEntity.class))).thenReturn(saleEntity);
            when(saleMapper.toResponseDTO(saleEntity)).thenReturn(saleRespDTO);

            saleService.updateSale(1L, updateDTO);

            assertThat(saleEntity.getVehicle()).isEqualTo(newVehicle);
        }

        @Test
        @DisplayName("Debería lanzar EntityNotFoundException cuando la venta a actualizar no existe")
        void updateSale_nonExistingId_throwsEntityNotFoundException() {
            when(saleRepository.findById(999L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> saleService.updateSale(999L, saleReqDTO))
                    .isInstanceOf(EntityNotFoundException.class)
                    .hasMessageContaining("999");
        }

        @Test
        @DisplayName("Debería lanzar EntityNotFoundException cuando el nuevo vehículo no existe")
        void updateSale_newVehicleNotFound_throwsEntityNotFoundException() {
            SaleReqDTO updateDTO = SaleReqDTO.builder()
                    .seller("Carlos")
                    .sellingPrice(new BigDecimal("16500.00"))
                    .saleDate(LocalDate.of(2026, 3, 15))
                    .vehicleVin("VIN_INEXISTENTE")
                    .build();

            when(saleRepository.findById(1L)).thenReturn(Optional.of(saleEntity));
            when(vehicleRepository.findById("VIN_INEXISTENTE")).thenReturn(Optional.empty());

            assertThatThrownBy(() -> saleService.updateSale(1L, updateDTO))
                    .isInstanceOf(EntityNotFoundException.class)
                    .hasMessageContaining("Vehicle Not found");
        }
    }
}
