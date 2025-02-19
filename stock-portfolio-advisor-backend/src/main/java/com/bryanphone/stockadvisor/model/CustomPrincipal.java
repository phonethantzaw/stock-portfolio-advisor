package com.bryanphone.stockadvisor.model;

import java.security.Principal;

public class CustomPrincipal implements Principal {
    private String name;

    public CustomPrincipal(String name) {
        this.name = name;
    }

    @Override
    public String getName() {
        return name;
    }

}
