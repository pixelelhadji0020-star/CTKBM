-- Activer RLS
alter default privileges revoke execute on functions from public;

-- Catégories
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  icon text default 'Package',
  filters jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

-- Produits
create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category_id uuid references categories(id) on delete cascade,
  description text default '',
  images text[] default array[]::text[],
  specs jsonb default '{}'::jsonb,
  options jsonb default '[]'::jsonb,
  is_available boolean default true,
  created_at timestamptz default now()
);

-- RLS : lecture publique des produits et catégories
alter table categories enable row level security;
alter table products enable row level security;

create policy "Public read categories" on categories for select using (true);
create policy "Public read products" on products for select using (true);
create policy "Admin full access categories" on categories for all using (auth.role() = 'authenticated');
create policy "Admin full access products" on products for all using (auth.role() = 'authenticated');

-- Seed des 3 catégories par défaut
insert into categories (name, slug, icon, filters) values
('Voitures', 'voitures', 'Car', '[
  {"key":"marque","label":"Marque","type":"select","options":["Toyota","Mercedes","BMW","Peugeot","Renault","Honda","Ford","Hyundai"]},
  {"key":"annee","label":"Année","type":"select","options":["2024","2023","2022","2021","2020","2019","2018"]},
  {"key":"transmission","label":"Transmission","type":"select","options":["Automatique","Manuelle"]},
  {"key":"carburant","label":"Carburant","type":"select","options":["Essence","Diesel","Hybride","Électrique"]}
]'::jsonb),
('Chaussures', 'chaussures', 'Footprints', '[
  {"key":"marque","label":"Marque","type":"select","options":["Nike","Adidas","Jordan","Puma","New Balance","Gucci","Louis Vuitton"]},
  {"key":"pointure","label":"Pointure","type":"select","options":["38","39","40","41","42","43","44","45","46"]},
  {"key":"genre","label":"Genre","type":"select","options":["Homme","Femme","Unisexe"]}
]'::jsonb),
('Téléphones', 'telephones', 'Smartphone', '[
  {"key":"marque","label":"Marque","type":"select","options":["Apple","Samsung","Xiaomi","Oppo","Tecno","Infinix","Huawei"]},
  {"key":"stockage","label":"Stockage","type":"select","options":["64 Go","128 Go","256 Go","512 Go","1 To"]},
  {"key":"etat","label":"État","type":"select","options":["Neuf","Occasion - Excellent","Occasion - Bon"]}
]'::jsonb);
