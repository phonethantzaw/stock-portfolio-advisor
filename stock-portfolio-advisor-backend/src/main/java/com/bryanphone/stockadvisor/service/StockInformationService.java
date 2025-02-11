package com.bryanphone.stockadvisor.service;

import com.bryanphone.stockadvisor.config.StockAPIConfig;
import dev.langchain4j.agent.tool.P;
import dev.langchain4j.agent.tool.Tool;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.List;


@Service
public class StockInformationService {

    private final StockAPIConfig stockAPIConfig;
    private final RestClient restClient;

    Logger log = LoggerFactory.getLogger(StockInformationService.class);

    public StockInformationService(StockAPIConfig stockAPIConfig, RestClient restClient) {
        this.stockAPIConfig = stockAPIConfig;
        this.restClient = restClient;
    }

    @Tool("Returns the stock price of the given stock symbols")
    public String getStockPrice(@P("Stock symbols separated by ,") String stockSymbols) {
        log.info("Fetching stock price for stock symbols: {}", stockSymbols);
        return fetchData("/quote/" + stockSymbols);
    }

    @Tool("Returns the company profile for the given stock symbols")
    public String getCompanyProfile(@P("Stock symbols separated by ,") String stockSymbols) {
        log.info("Fetching company profile for stock symbols: {}", stockSymbols);
        return fetchData("/profile/" + stockSymbols);
    }

    @Tool("Returns the balance sheet statements for the given stock symbols")
    public List<String> getBalanceSheetStatements(@P("Stock symbols separated by ,") String stockSymbols) {
        log.info("Fetching balance sheet statements for stock symbols: {}", stockSymbols);
        return fetchDataForMultipleSymbols(stockSymbols, "/balance-sheet-statement/");
    }

    @Tool("Returns the income statements for the given stock symbols")
    public List<String> getIncomeStatements(@P("Stock symbols separated by ,") String stockSymbols) {
        log.info("Fetching income statements for stock symbols: {}", stockSymbols);
        return fetchDataForMultipleSymbols(stockSymbols, "/income-statement/");
    }

    @Tool("Returns the cash flow statements for the given stock symbols")
    public List<String> getCashFlowStatements(@P("Stock symbols separated by ,") String stockSymbols) {
        log.info("Fetching cash flow statements for stock symbols: {}", stockSymbols);
        return fetchDataForMultipleSymbols(stockSymbols, "/cash-flow-statement/");
    }

    private List<String> fetchDataForMultipleSymbols(String stockSymbols, String s) {
        List<String> data = new ArrayList<>();
        for (String symbol : stockSymbols.split(",")) {
            String response = fetchData(s + symbol);
            data.add(response);
        }
        return data;
    }

    private String fetchData(String s) {
        return restClient.get()
                .uri(s + "?apikey=" + stockAPIConfig.getApiKey())
                .retrieve()
                .body(String.class)
                .replaceAll("\\s+", " ").trim();
    }


}
