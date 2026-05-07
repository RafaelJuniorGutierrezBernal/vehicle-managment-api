package com.auction.vehicleauctionapi.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;

import com.auction.vehicleauctionapi.model.dto.request.SaleReqDTO;
import com.auction.vehicleauctionapi.model.dto.response.SaleRespDTO;
import com.auction.vehicleauctionapi.model.entity.SaleEntity;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, uses = VehicleMapper.class)
public interface SaleMapper {
    SaleRespDTO toResponseDTO(SaleEntity saleEntity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "vehicle", ignore = true)
    SaleEntity toEntity(SaleReqDTO requestDTO);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "vehicle", ignore = true)
    void updateEntityFromDTO(SaleReqDTO reqDTO, @MappingTarget SaleEntity saleEntity);
}
