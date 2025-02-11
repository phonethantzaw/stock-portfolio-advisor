package com.bryanphone.stockadvisor.repository;

import com.bryanphone.stockadvisor.model.StockOrder;
import io.micrometer.observation.ObservationFilter;
import org.springframework.data.repository.ListCrudRepository;

import java.util.List;

public interface StockOrderRepository extends ListCrudRepository<StockOrder, Long> {

    List<StockOrder> findBySymbol(String symbol);

    ObservationFilter findTopByOrderByIdDesc();
}
