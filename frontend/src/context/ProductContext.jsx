import React, { createContext, useState, useEffect } from 'react';
import * as productService from '../services/productService';
import { toast } from 'react-toastify';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  });
  const [filters, setFilters] = useState({
    category: 'all',
    search: '',
    minPrice: '',
    maxPrice: '',
    sort: 'newest',
  });

  useEffect(() => {
    fetchProducts();
  }, [filters, pagination.page]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getProducts({
        ...filters,
        page: pagination.page,
      });
      setProducts(data.data);
      setPagination({
        page: data.page,
        pages: data.pages,
        total: data.total,
      });
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
    setPagination({ ...pagination, page: 1 });
  };

  const changePage = (page) => {
    setPagination({ ...pagination, page });
  };

  const value = {
    products,
    loading,
    pagination,
    filters,
    updateFilters,
    changePage,
    refreshProducts: fetchProducts,
  };

  return (
    
      {children}
    
  );
};