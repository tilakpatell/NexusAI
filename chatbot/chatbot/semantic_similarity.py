from sentence_transformers import SentenceTransformer, util
import numpy as np

# Load a pre-trained sentence transformer model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Sample product database
products = [
    "Applegate Organic Pork Chops",
    "Grass-Fed Beef Steak",
    "Organic Chicken Breast",
    "Wild-Caught Salmon Fillet",
    "Beyond Meat Plant-Based Burger"
]

# Convert product descriptions to embeddings
product_embeddings = model.encode(products, convert_to_tensor=True)

def search_products(query, top_n=3):
    query_embedding = model.encode(query, convert_to_tensor=True)
    similarities = util.pytorch_cos_sim(query_embedding, product_embeddings)[0]
    top_indices = np.argsort(-similarities.cpu().numpy())[:top_n]
    return [(products[i], similarities[i].item()) for i in top_indices]

# Example searches
query = "meat"
results = search_products(query)
for product, score in results:
    print(f"{product}: {score:.2f}")
