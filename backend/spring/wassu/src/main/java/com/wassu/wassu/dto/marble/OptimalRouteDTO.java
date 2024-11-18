package com.wassu.wassu.dto.marble;

import lombok.Getter;

import java.util.List;

@Getter
public class OptimalRouteDTO {

    private List<Spot> optimalRoute;

    @Getter
    public static class Spot {
        private String spotName;
    }

}
