package com.bryanphone.stockadvisor.repository;

import com.bryanphone.stockadvisor.model.StockOrder;
import io.micrometer.observation.ObservationFilter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockOrderRepository extends JpaRepository<StockOrder, Long> {

    List<StockOrder> findBySymbol(String symbol);

    ObservationFilter findTopByOrderByIdDesc();

    List<StockOrder> findByUserId(String userId);
}
