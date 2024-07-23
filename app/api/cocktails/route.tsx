import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const result = await sql`
      SELECT id, name, ingredients, recipe FROM cocktails
    `;

    const formattedResult = result.rows.map(row => ({
      ...row,
      ingredients: Array.isArray(row.ingredients) 
        ? row.ingredients 
        : JSON.parse(row.ingredients || '[]')
    }));

    return NextResponse.json({ result: formattedResult }, { status: 200 });
  } catch (error) {
    console.error('Error fetching cocktails:', error);
    return NextResponse.json({ error: 'Failed to fetch cocktails' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, ingredients, recipe } = await request.json();

    // Ensure ingredients is an array of strings
    if (!Array.isArray(ingredients) || !ingredients.every(item => typeof item === 'string')) {
      throw new Error('Ingredients must be an array of strings');
    }

    const formattedIngredients = `{${ingredients.map(ingredient => `"${ingredient}"`).join(',')}}`;
    const result = await sql`
      INSERT INTO cocktails (name, ingredients, recipe)
      VALUES (${name}, ${formattedIngredients}, ${recipe})
      RETURNING id, name, ingredients, recipe
    `;

    return NextResponse.json({ result: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Error adding cocktail:', error);
    return NextResponse.json({ error: 'Failed to add cocktail' }, { status: 500 });
  }
}
