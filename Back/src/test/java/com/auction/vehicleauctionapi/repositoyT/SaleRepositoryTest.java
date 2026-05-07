package com.auction.vehicleauctionapi.repositoyT;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.auction.vehicleauctionapi.model.entity.SaleEntity;
import com.auction.vehicleauctionapi.model.entity.VehicleEntity;
import com.auction.vehicleauctionapi.repository.SaleRepository;
import com.auction.vehicleauctionapi.repository.VehicleRepository;
import static org.assertj.core.api.Assertions.assertThat;

import java.math.BigDecimal;
import java.time.LocalDate;

@DataJpaTest
class SaleRepositoryTest {

  @Autowired
  SaleRepository saleRepository;
  @Autowired
  VehicleRepository vehicleRepository;

  @Test
  void saveAndFindById() {
    VehicleEntity vehicle = new VehicleEntity();
    vehicle.setVin("1HGCM82633A004352");
    vehicle.setYear(2018);
    vehicleRepository.save(vehicle);

    SaleEntity sale = new SaleEntity();
    sale.setSeller("AL");
    sale.setMmr(new BigDecimal("12000.00"));
    sale.setSellingPrice(new BigDecimal("12500.00"));
    sale.setSaleDate(LocalDate.parse("2026-02-09"));
    sale.setVehicle(vehicle);

    SaleEntity saved = saleRepository.save(sale);

    assertThat(saleRepository.findById(saved.getId())).isPresent();
  }
}
