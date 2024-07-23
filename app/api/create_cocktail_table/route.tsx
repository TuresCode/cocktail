import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Create the cocktails table
    await sql`
      CREATE TABLE IF NOT EXISTS cocktails (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        ingredients TEXT[] NOT NULL,
        recipe TEXT NOT NULL
      );
    `;

    // Insert data into the cocktails table
    await sql`
      INSERT INTO cocktails (name, ingredients, recipe) VALUES 
      ('Mojito', '{"rum", "mint", "lime", "sugar", "soda water"}', '1. Muddle mint leaves with sugar and lime juice.\n2. Add rum and fill glass with ice.\n3. Top with soda water and stir.\n4. Garnish with mint sprig and lime wedge.'),
      ('Margarita', '{"tequila", "lime juice", "triple sec", "salt"}', '1. Rub rim of glass with lime and dip in salt.\n2. Shake tequila, lime juice, and triple sec with ice.\n3. Strain into glass over ice.\n4. Garnish with lime wheel.'),
      ('Old Fashioned', '{"whiskey", "bitters", "sugar", "orange peel"}', '1. Muddle sugar with bitters and a splash of water.\n2. Add whiskey and ice, stir until chilled.\n3. Express orange peel over glass and drop in.'),
      ('Martini', '{"gin", "vermouth", "olive"}', '1. Stir gin and vermouth with ice.\n2. Strain into chilled martini glass.\n3. Garnish with olive.'),
      ('Daiquiri', '{"rum", "lime juice", "sugar"}', '1. Shake rum, lime juice, and sugar with ice.\n2. Strain into chilled coupe glass.\n3. Garnish with lime wheel.');
    `;

    return NextResponse.json({ message: 'Table created and data inserted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
