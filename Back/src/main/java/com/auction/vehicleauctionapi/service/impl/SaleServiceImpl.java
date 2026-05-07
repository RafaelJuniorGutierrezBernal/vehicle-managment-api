package com.auction.vehicleauctionapi.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.auction.vehicleauctionapi.mapper.SaleMapper;
import com.auction.vehicleauctionapi.model.dto.request.SaleReqDTO;
import com.auction.vehicleauctionapi.model.dto.response.SaleRespDTO;
import com.auction.vehicleauctionapi.model.entity.SaleEntity;
import com.auction.vehicleauctionapi.model.entity.VehicleEntity;
import com.auction.vehicleauctionapi.repository.SaleRepository;
import com.auction.vehicleauctionapi.repository.VehicleRepository;
import com.auction.vehicleauctionapi.service.SaleService;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SaleServiceImpl implements SaleService {
    private final SaleRepository saleRepository;
    private final VehicleRepository vehicleRepository;
    private final SaleMapper saleMapper;

    @Override
    public SaleRespDTO create(SaleReqDTO reqDTO) {
        String vin = reqDTO.getVehicleVin().trim();
        VehicleEntity vehicle = vehicleRepository.findById(vin)
                .orElseThrow(() -> new EntityNotFoundException("There is no vehicle with vin: " + vin));

        vehicle.setState("Vendido");
        vehicleRepository.save(vehicle);

        SaleEntity sale = saleMapper.toEntity(reqDTO);
        sale.setVehicle(vehicle);
        sale = saleRepository.save(sale);
        return saleMapper.toResponseDTO(sale);

    }

    @Override
    public SaleRespDTO getById(Long id) {
        SaleEntity sale = saleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Sale with ID: " + id));
        return saleMapper.toResponseDTO(sale);
    }

    @Override
    public List<SaleRespDTO> list() {
        return saleRepository.findAll().stream()
                .map(saleMapper::toResponseDTO)
                .toList();
    }

    @Override
    public void deleteById(Long id) {
        saleRepository.deleteById(id);
    }

    @Override
    public SaleRespDTO updateSale(Long id, SaleReqDTO saleReqDTO) {
        SaleEntity existingSale = saleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Sale with ID: " + id + " not found"));

        if (!existingSale.getVehicle().getVin().equals(saleReqDTO.getVehicleVin())) {
            VehicleEntity newVehicle = vehicleRepository.findById(saleReqDTO.getVehicleVin())
                    .orElseThrow(() -> new EntityNotFoundException("Vehicle Not found"));
            existingSale.setVehicle(newVehicle);
        }

        saleMapper.updateEntityFromDTO(saleReqDTO, existingSale);

        existingSale = saleRepository.save(existingSale);

        return saleMapper.toResponseDTO(existingSale);

    }
}
