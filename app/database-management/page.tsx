'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Cocktail {
  id: number;
  name: string;
  ingredients: string[];
  recipe: string;
}

export default function DatabaseManagement() {
  const [cocktails, setCocktails] = useState<Cocktail[]>([]);
  const [newCocktail, setNewCocktail] = useState<Omit<Cocktail, 'id'>>({
    name: '',
    ingredients: [],
    recipe: ''
  });

  useEffect(() => {
    fetchCocktails();
  }, []);

  const fetchCocktails = async () => {
    try {
      const response = await fetch('/api/cocktails');
      const data = await response.json();
      setCocktails(data.result);
    } catch (error) {
      console.error('Error fetching cocktails:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCocktail(prev => ({
      ...prev,
      [name]: name === 'ingredients' ? value.split(',').map(i => i.trim()) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/cocktails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCocktail),
      });
      if (response.ok) {
        fetchCocktails();
        setNewCocktail({ name: '', ingredients: [], recipe: '' });
      } else {
        const errorData = await response.json();
        console.error('Error adding cocktail:', errorData.error);
      }
    } catch (error) {
      console.error('Error adding cocktail:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 text-white p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Database Management</h1>
          <Link href="/" className="bg-white text-purple-600 px-4 py-2 rounded-md hover:bg-purple-100 transition-colors">
            Back to Suggester
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="mb-8 bg-white/10 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Add New Cocktail</h2>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={newCocktail.name}
              onChange={handleInputChange}
              className="w-full bg-white/5 rounded-md py-2 px-4 text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="ingredients" className="block mb-2">Ingredients (comma-separated):</label>
            <input
              type="text"
              id="ingredients"
              name="ingredients"
              value={newCocktail.ingredients.join(', ')}
              onChange={handleInputChange}
              className="w-full bg-white/5 rounded-md py-2 px-4 text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="recipe" className="block mb-2">Recipe:</label>
            <textarea
              id="recipe"
              name="recipe"
              value={newCocktail.recipe}
              onChange={handleInputChange}
              className="w-full bg-white/5 rounded-md py-2 px-4 text-white h-32"
              required
            />
          </div>
          <button type="submit" className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition-colors">
            Add Cocktail
          </button>
        </form>

        <div className="bg-white/10 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Existing Cocktails</h2>
          <ul className="space-y-4">
            {cocktails.map(cocktail => (
              <li key={cocktail.id} className="bg-white/5 p-4 rounded-md">
                <h3 className="text-xl font-medium mb-2">{cocktail.name}</h3>
                <p className="mb-2"><strong>Ingredients:</strong> {cocktail.ingredients.join(', ')}</p>
                <p><strong>Recipe:</strong> {cocktail.recipe}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}