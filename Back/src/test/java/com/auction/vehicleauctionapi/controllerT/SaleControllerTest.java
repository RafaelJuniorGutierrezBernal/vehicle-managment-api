package com.auction.vehicleauctionapi.controllerT;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.auction.vehicleauctionapi.controller.SaleController;
import com.auction.vehicleauctionapi.model.dto.request.SaleReqDTO;
import com.auction.vehicleauctionapi.model.dto.response.SaleRespDTO;
import com.auction.vehicleauctionapi.model.dto.response.VehicleRespDTO;
import com.auction.vehicleauctionapi.service.SaleService;

import jakarta.persistence.EntityNotFoundException;

@WebMvcTest(SaleController.class)
@AutoConfigureMockMvc(addFilters = false)
@DisplayName("SaleController — Integration Tests")
class SaleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SaleService saleService;

    private SaleRespDTO saleRespDTO;

    @BeforeEach
    void setUp() {
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

    // ── POST /api/sales ──────────────────────────────────────

    @Nested
    @DisplayName("POST /api/sales")
    class CreateTests {

        @Test
        @DisplayName("Debería retornar 201 CREATED con body válido")
        void createSale_validBody_returns201() throws Exception {
            when(saleService.create(any(SaleReqDTO.class))).thenReturn(saleRespDTO);

            String body = """
                {
                    "seller": "Carlos",
                    "mmr": 15000.00,
                    "sellingPrice": 16500.00,
                    "saleDate": "2026-03-15",
                    "vehicleVin": "1HGCM82633A004352"
                }
                """;

            mockMvc.perform(post("/api/sales")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(body))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.id").value(1))
                    .andExpect(jsonPath("$.seller").value("Carlos"))
                    .andExpect(jsonPath("$.vehicle.vin").value("1HGCM82633A004352"));
        }

        @Test
        @DisplayName("Debería retornar 400 cuando faltan campos obligatorios")
        void createSale_missingRequiredFields_returns400() throws Exception {
            String body = """
                {
                    "mmr": 15000.00
                }
                """;

            mockMvc.perform(post("/api/sales")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(body))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("Debería retornar 400 cuando sellingPrice es negativo")
        void createSale_negativePrice_returns400() throws Exception {
            String body = """
                {
                    "seller": "Carlos",
                    "mmr": 15000.00,
                    "sellingPrice": -100.00,
                    "saleDate": "2026-03-15",
                    "vehicleVin": "1HGCM82633A004352"
                }
                """;

            mockMvc.perform(post("/api/sales")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(body))
                    .andExpect(status().isBadRequest());
        }
    }

    // ── GET /api/sales/{id} ──────────────────────────────────

    @Nested
    @DisplayName("GET /api/sales/{id}")
    class GetByIdTests {

        @Test
        @DisplayName("Debería retornar 200 con la venta cuando el ID existe")
        void getSale_existingId_returns200() throws Exception {
            when(saleService.getById(1L)).thenReturn(saleRespDTO);

            mockMvc.perform(get("/api/sales/1"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(1))
                    .andExpect(jsonPath("$.seller").value("Carlos"));
        }

        @Test
        @DisplayName("Debería retornar 404 cuando la venta no existe")
        void getSale_nonExistingId_returns404() throws Exception {
            when(saleService.getById(999L)).thenThrow(new EntityNotFoundException("Sale with ID: 999"));

            mockMvc.perform(get("/api/sales/999"))
                    .andExpect(status().isNotFound());
        }
    }

    // ── GET /api/sales ───────────────────────────────────────

    @Nested
    @DisplayName("GET /api/sales")
    class ListTests {

        @Test
        @DisplayName("Debería retornar 200 con la lista de ventas")
        void listSales_returns200WithList() throws Exception {
            SaleRespDTO second = new SaleRespDTO();
            second.setId(2L);
            second.setSeller("Ana");

            when(saleService.list()).thenReturn(List.of(saleRespDTO, second));

            mockMvc.perform(get("/api/sales"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.length()").value(2))
                    .andExpect(jsonPath("$[0].seller").value("Carlos"))
                    .andExpect(jsonPath("$[1].seller").value("Ana"));
        }
    }

    // ── DELETE /api/sales/{id} ───────────────────────────────

    @Nested
    @DisplayName("DELETE /api/sales/{id}")
    class DeleteTests {

        @Test
        @DisplayName("Debería retornar 204 cuando la eliminación es exitosa")
        void deleteSale_returns204() throws Exception {
            doNothing().when(saleService).deleteById(1L);

            mockMvc.perform(delete("/api/sales/1"))
                    .andExpect(status().isNoContent());
        }
    }

    // ── PUT /api/sales/{id} ──────────────────────────────────

    @Nested
    @DisplayName("PUT /api/sales/{id}")
    class UpdateTests {

        @Test
        @DisplayName("Debería retornar 200 al actualizar una venta existente")
        void updateSale_validBody_returns200() throws Exception {
            when(saleService.updateSale(eq(1L), any(SaleReqDTO.class))).thenReturn(saleRespDTO);

            String body = """
                {
                    "seller": "Carlos Updated",
                    "mmr": 15000.00,
                    "sellingPrice": 17000.00,
                    "saleDate": "2026-03-15",
                    "vehicleVin": "1HGCM82633A004352"
                }
                """;

            mockMvc.perform(put("/api/sales/1")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(body))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(1));
        }

        @Test
        @DisplayName("Debería retornar 404 al actualizar una venta que no existe")
        void updateSale_nonExistingId_returns404() throws Exception {
            when(saleService.updateSale(eq(999L), any(SaleReqDTO.class)))
                    .thenThrow(new EntityNotFoundException("Sale with ID: 999 not found"));

            String body = """
                {
                    "seller": "Carlos",
                    "mmr": 15000.00,
                    "sellingPrice": 16500.00,
                    "saleDate": "2026-03-15",
                    "vehicleVin": "1HGCM82633A004352"
                }
                """;

            mockMvc.perform(put("/api/sales/999")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(body))
                    .andExpect(status().isNotFound());
        }
    }
}
