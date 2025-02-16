package NexusAI.storeMockAPI.controllers.Product;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Product {
    private String name;
    private String type;
    private int id;
    private int aisle;
    private double price;
    private boolean inStock;
}
