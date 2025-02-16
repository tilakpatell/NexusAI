package NexusAI.storeMockAPI.controllers.Product;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/product")
public class ProductDataController {

    private final ProductData productData = new ProductData();

    @GetMapping("/findProduct")
    public String findProduct(@RequestParam String productToFind) {
        String product = productData.findProduct(productToFind);
        if (product == null) {
            return "Product not found";
        }
        return product;
    }

    @GetMapping("/findProductPrice")
    public Double findProductPrice(@RequestParam String productToFind) {
        String product = productData.findProduct(productToFind);
        if (product == null) {
            return null; // Return null or handle error properly
        }
        return productData.findProductPrice(product);
    }

    @GetMapping("/findProductAisle")
    public Integer findProductAisle(@RequestParam String productToFind) {
        return productData.findProductAisle(productToFind);
    }

    @GetMapping("/findProductInStock")
    public Boolean findProductInStock(@RequestParam String productToFind) {
        return productData.findProductInStock(productToFind);
    }
}
