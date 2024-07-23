'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Dummy data for cocktails and ingredients
// const cocktails = [
//   { 
//     id: 1, 
//     name: 'Mojito', 
//     ingredients: ['rum', 'mint', 'lime', 'sugar', 'soda water'],
//     recipe: "1. Muddle mint leaves with sugar and lime juice.\n2. Add rum and fill glass with ice.\n3. Top with soda water and stir.\n4. Garnish with mint sprig and lime wedge."
//   },
//   { 
//     id: 2, 
//     name: 'Margarita', 
//     ingredients: ['tequila', 'lime juice', 'triple sec', 'salt'],
//     recipe: "1. Rub rim of glass with lime and dip in salt.\n2. Shake tequila, lime juice, and triple sec with ice.\n3. Strain into glass over ice.\n4. Garnish with lime wheel."
//   },
//   { 
//     id: 3, 
//     name: 'Old Fashioned', 
//     ingredients: ['whiskey', 'bitters', 'sugar', 'orange peel'],
//     recipe: "1. Muddle sugar with bitters and a splash of water.\n2. Add whiskey and ice, stir until chilled.\n3. Express orange peel over glass and drop in."
//   },
//   { 
//     id: 4, 
//     name: 'Martini', 
//     ingredients: ['gin', 'vermouth', 'olive'],
//     recipe: "1. Stir gin and vermouth with ice.\n2. Strain into chilled martini glass.\n3. Garnish with olive."
//   },
//   { 
//     id: 5, 
//     name: 'Daiquiri', 
//     ingredients: ['rum', 'lime juice', 'sugar'],
//     recipe: "1. Shake rum, lime juice, and sugar with ice.\n2. Strain into chilled coupe glass.\n3. Garnish with lime wheel."
//   },
// ];

// const allIngredients = [...new Set(cocktails.flatMap(cocktail => cocktail.ingredients))];

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white text-gray-800 rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function CocktailSuggestionApp() {
  const [userIngredients, setUserIngredients] = useState<string[]>([]);
  const [cocktails, setCocktails] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCocktail, setSelectedCocktail] = useState(null);
  const [allIngredients, setAllIngredients] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/cocktails')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data.result)) {
          setCocktails(data.result);
          const ingredients = data.result.reduce((acc: string[], cocktail: any) => {
            if (Array.isArray(cocktail.ingredients)) {
              acc.push(...cocktail.ingredients);
            }
            return acc;
          }, []);
          setAllIngredients(Array.from(new Set(ingredients)));
        } else {
          console.error('Unexpected data format:', data);
          setCocktails([]);
          setAllIngredients([]);
        }
      })
      .catch(error => {
        console.error('Error fetching cocktails:', error);
        setCocktails([]);
        setAllIngredients([]);
      });
  }, []);

  useEffect(() => {
    const filteredCocktails = cocktails.filter(cocktail =>
      Array.isArray(cocktail.ingredients) && 
      cocktail.ingredients.some(ingredient => userIngredients.includes(ingredient))
    ).map(cocktail => ({
      ...cocktail,
      matchedIngredients: cocktail.ingredients.filter(ingredient => userIngredients.includes(ingredient)),
      missingIngredients: cocktail.ingredients.filter(ingredient => !userIngredients.includes(ingredient))
    }));

    filteredCocktails.sort((a, b) => b.matchedIngredients.length - a.matchedIngredients.length);

    setSuggestions(filteredCocktails);
  }, [userIngredients, cocktails]);

  const addIngredient = (ingredient: string) => {
    if (!userIngredients.includes(ingredient)) {
      setUserIngredients([...userIngredients, ingredient]);
    }
    setSearchTerm('');
  };

  const removeIngredient = (ingredient: string) => {
    setUserIngredients(userIngredients.filter(i => i !== ingredient));
  };

  const filteredIngredients = allIngredients.filter(ingredient =>
    ingredient.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !userIngredients.includes(ingredient)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 text-white p-8">
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-center">Cocktail Suggester</h1>
        <Link href="/database-management" className="bg-white text-purple-600 px-4 py-2 rounded-md hover:bg-purple-100 transition-colors">
          Manage Database
        </Link>
      </div>
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Ingredients</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {userIngredients.map(ingredient => (
              <span key={ingredient} className="bg-white/20 rounded-full px-3 py-1 text-sm flex items-center">
                {ingredient}
                <button onClick={() => removeIngredient(ingredient)} className="ml-2 text-white/50 hover:text-white">
                  ✕
                </button>
              </span>
            ))}
          </div>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search ingredients..."
              className="w-full bg-white/5 rounded-md py-2 pl-10 pr-4 outline-none focus:ring-2 focus:ring-white/50"
            />
            <span className="absolute left-3 top-2.5 text-white/50">🔍</span>
          </div>
          {searchTerm && (
            <ul className="mt-2 bg-white/5 rounded-md overflow-hidden">
              {filteredIngredients.map(ingredient => (
                <li
                  key={ingredient}
                  onClick={() => addIngredient(ingredient)}
                  className="px-4 py-2 hover:bg-white/10 cursor-pointer"
                >
                  {ingredient}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Suggested Cocktails</h2>
          {suggestions.length > 0 ? (
            <ul className="space-y-4">
              {suggestions.map(cocktail => (
                <li 
                  key={cocktail.id} 
                  className="bg-white/5 rounded-lg p-4 cursor-pointer hover:bg-white/10 transition-colors"
                  onClick={() => setSelectedCocktail(cocktail)}
                >
                  <h3 className="text-xl font-medium mb-2 flex items-center">
                    <span className="mr-2">🍸</span>
                    {cocktail.name}
                  </h3>
                  <p className="text-sm text-white/70 mb-2">
                    Matched ingredients: {cocktail.matchedIngredients.join(', ')}
                  </p>
                  <p className="text-sm text-white/50">
                    Missing ingredients: {cocktail.missingIngredients.join(', ')}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-white/70">No cocktails found with your current ingredients. Try adding more!</p>
          )}
        </div>
      </div>

      <Modal isOpen={!!selectedCocktail} onClose={() => setSelectedCocktail(null)}>
        {selectedCocktail && (
          <div>
            <h2 className="text-2xl font-bold mb-4">{selectedCocktail.name}</h2>
            <h3 className="text-lg font-semibold mb-2">Ingredients:</h3>
            <ul className="list-disc list-inside mb-4">
              {selectedCocktail.ingredients.map(ingredient => (
                <li key={ingredient} className={userIngredients.includes(ingredient) ? "text-green-600" : ""}>
                  {ingredient}
                </li>
              ))}
            </ul>
            <h3 className="text-lg font-semibold mb-2">Recipe:</h3>
            <p className="whitespace-pre-line">{selectedCocktail.recipe}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}