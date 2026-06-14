-- Autoriser la lecture publique des catégories
drop policy if exists "Public read categories" on categories;
create policy "Public read categories" on categories for select using (true);

-- Autoriser la lecture publique des produits
drop policy if exists "Public read products" on products;
create policy "Public read products" on products for select using (true);
