import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
}

interface Stats {
  total: number;
  inStock: number;
  lowStock: number;
  totalValue: number;
}

interface ProductContextValue {
  products: Product[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  category: string;
  setCategory: (category: string) => void;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
  stats: Stats;
}

const ProductContext = createContext<ProductContextValue | undefined>(undefined);

const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    const fetchProducts = () => {
      const mockProducts: Product[] = [
        { id: 1, name: 'Laptop', price: 999, category: 'electronics', stock: 5 },
        { id: 2, name: 'Phone', price: 699, category: 'electronics', stock: 12 },
        { id: 3, name: 'Shirt', price: 29, category: 'clothing', stock: 50 },
        { id: 4, name: 'Shoes', price: 79, category: 'clothing', stock: 30 },
        { id: 5, name: 'Watch', price: 199, category: 'accessories', stock: 8 },
        { id: 6, name: 'Headphones', price: 149, category: 'electronics', stock: 15 },
        { id: 7, name: 'Backpack', price: 59, category: 'accessories', stock: 20 },
        { id: 8, name: 'Jacket', price: 120, category: 'clothing', stock: 10 },
      ];
      setProducts(mockProducts);
    };

    fetchProducts();
  });

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'all' || product.category === category;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'price-low') {
      return a.price - b.price;
    } else if (sortBy === 'price-high') {
      return b.price - a.price;
    }
    return 0;
  });

  const stats: Stats = {
    total: products.length,
    inStock: products.filter(p => p.stock > 0).length,
    lowStock: products.filter(p => p.stock > 0 && p.stock < 10).length,
    totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0),
  };

  return (
    <ProductContext.Provider
      value={{
        products: sortedProducts,
        searchTerm,
        setSearchTerm,
        category,
        setCategory,
        sortBy,
        setSortBy,
        stats,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

const ProductCard = ({ product, onAddToCart }: { product: Product; onAddToCart: (product: Product) => void }) => {
  const discount = product.price > 100 ? product.price * 0.1 : 0;
  const finalPrice = product.price - discount;

  console.log(`Rendering ProductCard: ${product.name}`);

  return (
    <Paper elevation={3}>
      <Box sx={{ padding: '16px' }}>
        <Typography variant="h6" style={{ marginBottom: '8px' }}>
          {product.name}
        </Typography>
        <Typography variant="body2" style={{ color: '#666', textTransform: 'capitalize' }}>
          {product.category}
        </Typography>
        <Typography variant="h5" style={{ marginTop: '16px' }}>
          ${finalPrice.toFixed(2)}
        </Typography>
        {discount > 0 && (
          <Typography variant="caption" style={{ color: '#d32f2f' }}>
            Save ${discount.toFixed(2)}!
          </Typography>
        )}
        <Typography variant="body2" sx={{ mt: 1 }}>
          Stock: {product.stock}
        </Typography>
        <Box sx={{ marginTop: '16px' }}>
          <Button
            variant="contained"
            color={product.stock === 0 ? 'default' : 'primary'}
            fullWidth
            onClick={() => onAddToCart(product)}
            disabled={product.stock === 0}
          >
            Add to Cart
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

const FilterBar = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('FilterBar must be used within ProductProvider');

  const { searchTerm, setSearchTerm, category, setCategory, sortBy, setSortBy } = context;

  useEffect(() => {
    console.log('Search term changed:', searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    console.log('Category changed:', category);
  }, [category]);

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Search products"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <MenuItem value="all">All Categories</MenuItem>
              <MenuItem value="electronics">Electronics</MenuItem>
              <MenuItem value="clothing">Clothing</MenuItem>
              <MenuItem value="accessories">Accessories</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="price-low">Price: Low to High</MenuItem>
              <MenuItem value="price-high">Price: High to Low</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Paper>
  );
};

const StatsBar = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('StatsBar must be used within ProductProvider');

  const { stats } = context;

  console.log('Rendering StatsBar');

  return (
    <Paper elevation={2} sx={{ padding: 2, marginBottom: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="caption" style={{ color: '#999' }}>Total Products</Typography>
          <Typography variant="h6">{stats.total}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" style={{ color: '#999' }}>In Stock</Typography>
          <Typography variant="h6">{stats.inStock}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" style={{ color: '#999' }}>Low Stock</Typography>
          <Typography variant="h6" style={{ color: '#ff9800' }}>{stats.lowStock}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" style={{ color: '#999' }}>Total Value</Typography>
          <Typography variant="h6">${stats.totalValue.toFixed(2)}</Typography>
        </Box>
      </Box>
    </Paper>
  );
};

const ProductList = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('ProductList must be used within ProductProvider');

  const { products } = context;
  const [cart, setCart] = useState<Product[]>([]);

  const handleAddToCart = (product: Product) => {
    setCart([...cart, product]);
    console.log('Cart after adding:', cart);
    alert(`Added ${product.name} to cart!`);
  };

  console.log('Rendering ProductList');

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Cart Items: {cart.length}
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {products.map((product) => (
          <Box key={product.id} sx={{ width: '300px' }}>
            <ProductCard product={product} onAddToCart={handleAddToCart} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default function Products() {
  return (
    <ProductProvider>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Challenge 2: Fix React Anti-patterns
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            This page has 10+ React anti-patterns and performance issues. Find and fix them all!
            Open the browser console to see excessive rendering.
          </Typography>

          <StatsBar />
          <FilterBar />
          <ProductList />
        </Paper>
      </Container>
    </ProductProvider>
  );
}
