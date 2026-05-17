package com.auction.vehicleauctionapi.controllerT;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

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

import com.auction.vehicleauctionapi.controller.VehicleController;
import com.auction.vehicleauctionapi.model.dto.request.VehicleReqDTO;
import com.auction.vehicleauctionapi.model.dto.response.VehicleRespDTO;
import com.auction.vehicleauctionapi.service.VehicleService;

import jakarta.persistence.EntityNotFoundException;

@WebMvcTest(VehicleController.class)
@AutoConfigureMockMvc(addFilters = false)
@DisplayName("VehicleController — Integration Tests")
class VehicleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private VehicleService vehicleService;

    private VehicleRespDTO vehicleRespDTO;

    @BeforeEach
    void setUp() {
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

    // ── POST /api/vehicles ───────────────────────────────────

    @Nested
    @DisplayName("POST /api/vehicles")
    class CreateTests {

        @Test
        @DisplayName("Debería retornar 201 CREATED al crear un vehículo válido")
        void createVehicle_validBody_returns201() throws Exception {
            when(vehicleService.create(any(VehicleReqDTO.class))).thenReturn(vehicleRespDTO);

            String body = """
                {
                    "vin": "1HGCM82633A004352",
                    "year": 2020,
                    "make": "Honda",
                    "model": "Accord",
                    "trim": "Sport",
                    "body": "Sedan",
                    "transmission": "Automatic",
                    "state": "Disponible",
                    "condition": 45,
                    "odometer": 35000,
                    "color": "White",
                    "interior": "Black"
                }
                """;

            mockMvc.perform(post("/api/vehicles")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(body))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.vin").value("1HGCM82633A004352"))
                    .andExpect(jsonPath("$.make").value("Honda"))
                    .andExpect(jsonPath("$.model").value("Accord"));
        }

        @Test
        @DisplayName("Debería retornar 400 cuando faltan campos obligatorios (VIN)")
        void createVehicle_invalidBody_returns400() throws Exception {
            String body = """
                {
                    "year": 2020,
                    "make": "Honda"
                }
                """;

            mockMvc.perform(post("/api/vehicles")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(body))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("Debería retornar 500 cuando el VIN ya existe en el sistema")
        void createVehicle_duplicateVin_returns500() throws Exception {
            when(vehicleService.create(any(VehicleReqDTO.class)))
                    .thenThrow(new IllegalArgumentException("Vehicle with VIN 1HGCM82633A004352 already exists."));

            String body = """
                {
                    "vin": "1HGCM82633A004352",
                    "year": 2020,
                    "make": "Honda",
                    "model": "Accord"
                }
                """;

            mockMvc.perform(post("/api/vehicles")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(body))
                    .andExpect(status().isInternalServerError());
        }
    }

    // ── GET /api/vehicles/{vin} ──────────────────────────────

    @Nested
    @DisplayName("GET /api/vehicles/{vin}")
    class GetByVinTests {

        @Test
        @DisplayName("Debería retornar 200 con el vehículo cuando el VIN existe")
        void getVehicle_existingVin_returns200() throws Exception {
            when(vehicleService.getByVin("1HGCM82633A004352")).thenReturn(vehicleRespDTO);

            mockMvc.perform(get("/api/vehicles/1HGCM82633A004352"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.vin").value("1HGCM82633A004352"))
                    .andExpect(jsonPath("$.make").value("Honda"));
        }

        @Test
        @DisplayName("Debería retornar 404 cuando el VIN no existe")
        void getVehicle_nonExistingVin_returns404() throws Exception {
            when(vehicleService.getByVin("VIN_FAKE")).thenThrow(new EntityNotFoundException());

            mockMvc.perform(get("/api/vehicles/VIN_FAKE"))
                    .andExpect(status().isNotFound());
        }
    }

    // ── GET /api/vehicles/list ───────────────────────────────

    @Nested
    @DisplayName("GET /api/vehicles/list")
    class ListTests {

        @Test
        @DisplayName("Debería retornar 200 con la lista de vehículos")
        void listVehicles_returns200WithList() throws Exception {
            VehicleRespDTO second = new VehicleRespDTO();
            second.setVin("5YJSA1E26MF123456");
            second.setMake("Tesla");

            when(vehicleService.list()).thenReturn(List.of(vehicleRespDTO, second));

            mockMvc.perform(get("/api/vehicles/list"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.length()").value(2))
                    .andExpect(jsonPath("$[0].vin").value("1HGCM82633A004352"))
                    .andExpect(jsonPath("$[1].vin").value("5YJSA1E26MF123456"));
        }
    }

    // ── DELETE /api/vehicles/{vin} ───────────────────────────

    @Nested
    @DisplayName("DELETE /api/vehicles/{vin}")
    class DeleteTests {

        @Test
        @DisplayName("Debería retornar 204 cuando la eliminación es exitosa")
        void deleteVehicle_returns204() throws Exception {
            doNothing().when(vehicleService).deleteByVin("1HGCM82633A004352");

            mockMvc.perform(delete("/api/vehicles/1HGCM82633A004352"))
                    .andExpect(status().isNoContent());
        }
    }

    // ── PUT /api/vehicles/{vin} ──────────────────────────────

    @Nested
    @DisplayName("PUT /api/vehicles/{vin}")
    class UpdateTests {

        @Test
        @DisplayName("Debería retornar 200 al actualizar un vehículo existente")
        void updateVehicle_validBody_returns200() throws Exception {
            when(vehicleService.updateVehicle(eq("1HGCM82633A004352"), any(VehicleReqDTO.class)))
                    .thenReturn(vehicleRespDTO);

            String body = """
                {
                    "vin": "1HGCM82633A004352",
                    "year": 2021,
                    "make": "Honda",
                    "model": "Accord",
                    "color": "Black"
                }
                """;

            mockMvc.perform(put("/api/vehicles/1HGCM82633A004352")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(body))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.vin").value("1HGCM82633A004352"));
        }

        @Test
        @DisplayName("Debería retornar 404 al actualizar un vehículo que no existe")
        void updateVehicle_nonExistingVin_returns404() throws Exception {
            when(vehicleService.updateVehicle(eq("VIN_FAKE"), any(VehicleReqDTO.class)))
                    .thenThrow(new EntityNotFoundException("Vehicle whith VIN: VIN_FAKE not found"));

            String body = """
                {
                    "vin": "VIN_FAKE",
                    "year": 2020,
                    "make": "Honda",
                    "model": "Accord"
                }
                """;

            mockMvc.perform(put("/api/vehicles/VIN_FAKE")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(body))
                    .andExpect(status().isNotFound());
        }
    }
}
