package NexusAI.storeMockAPI.controllers.Product;
import java.util.ArrayList;
import java.util.List;

public class ProductData {
    List<Product> products = new ArrayList<Product>();
    public ProductData() {
        products.add(new Product("Granny Smith Apple", "apple", 1, 1, 0.99, true));
        products.add(new Product("Dole Organic Banana", "banana", 2, 1, 0.59, false));
        products.add(new Product("Sunkist Navel Orange", "orange", 3, 1, 0.79, true));
        products.add(new Product("Horizon Whole Milk", "milk", 4, 2, 2.99, false));
        products.add(new Product("Vital Farms Free-Range Eggs", "eggs", 5, 2, 1.99, true));
        products.add(new Product("Nature's Own Whole Wheat Bread", "bread", 6, 2, 1.49, false));
        products.add(new Product("Foster Farms Chicken Breasts", "chicken", 7, 3, 4.99, true));
        products.add(new Product("Kroger 90% Lean Grass-Fed Beef", "beef", 8, 3, 5.99, false));
        products.add(new Product("Applegate Organic Pork Chops", "pork", 9, 3, 3.99, true));
        products.add(new Product("Herbal Essences Tea Tree Oil Shampoo", "shampoo", 10, 4, 6.99, true));
        products.add(new Product("Dove Soap Cucumber & Mint", "soap", 11, 4, 2.99, false));
        products.add(new Product("Colgate Strengthening Toothpaste","toothpaste", 12, 4, 3.99, true));
    }

    public String findProduct(String productToFind){
        for (Product product : products) {
            if(product.getType().equals(productToFind) && product.isInStock()){
                return product.getName();
            }
        }
        return "No products in stock";
    }

    public double findProductPrice(String productToFind){
        for (Product product : products) {
            if(product.getName().equals(productToFind)){
                return product.getPrice();
            }
        }
        return 0.0;
    }

    public int findProductAisle(String productToFind){
        for (Product product : products) {
            if(product.getType().equals(productToFind)){
                return product.getAisle();
            }
        }
        return 0;
    }

    public boolean findProductInStock(String productToFind){
        for (Product product : products) {
            if(product.getType().equals(productToFind)){
                return product.isInStock();
            }
        }
        return false;
    }
}
