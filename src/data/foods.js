// Alimenti comuni: valori per 100 g (fonti: tabelle USDA FoodData Central / CREA, valori medi arrotondati).
// [id, kcal, proteine, carboidrati, grassi, porzione tipica in g, [it, en, es, fr, de, pt]]
import { LANGS } from './exercises.js';

const RAW = [
  ['chicken_breast', 165, 31, 0, 3.6, 150, ['Petto di pollo (cotto)', 'Chicken breast (cooked)', 'Pechuga de pollo (cocida)', 'Blanc de poulet (cuit)', 'Hähnchenbrust (gegart)', 'Peito de frango (cozido)']],
  ['turkey_breast', 135, 30, 0, 1.5, 150, ['Petto di tacchino (cotto)', 'Turkey breast (cooked)', 'Pechuga de pavo (cocida)', 'Blanc de dinde (cuit)', 'Putenbrust (gegart)', 'Peito de peru (cozido)']],
  ['beef_lean', 200, 29, 0, 9, 150, ['Manzo magro (cotto)', 'Lean beef (cooked)', 'Ternera magra (cocida)', 'Bœuf maigre (cuit)', 'Mageres Rindfleisch (gegart)', 'Carne bovina magra (cozida)']],
  ['salmon', 206, 22, 0, 12, 150, ['Salmone (cotto)', 'Salmon (cooked)', 'Salmón (cocido)', 'Saumon (cuit)', 'Lachs (gegart)', 'Salmão (cozido)']],
  ['cod', 105, 23, 0, 0.9, 150, ['Merluzzo (cotto)', 'Cod (cooked)', 'Bacalao fresco (cocido)', 'Cabillaud (cuit)', 'Kabeljau (gegart)', 'Bacalhau fresco (cozido)']],
  ['tuna_canned', 116, 26, 0, 1, 80, ['Tonno al naturale', 'Tuna in water (drained)', 'Atún al natural', 'Thon au naturel', 'Thunfisch im eigenen Saft', 'Atum em água']],
  ['egg', 143, 12.6, 0.7, 9.5, 120, ['Uova intere', 'Whole eggs', 'Huevos enteros', 'Œufs entiers', 'Eier', 'Ovos inteiros']],
  ['egg_white', 52, 11, 0.7, 0.2, 100, ['Albumi', 'Egg whites', 'Claras de huevo', 'Blancs d\'œuf', 'Eiklar', 'Claras de ovo']],
  ['ham', 145, 19, 1.5, 7, 50, ['Prosciutto cotto', 'Cooked ham', 'Jamón cocido', 'Jambon blanc', 'Kochschinken', 'Fiambre (presunto cozido)']],
  ['bresaola', 151, 32, 0, 2.6, 50, ['Bresaola', 'Bresaola (air-dried beef)', 'Bresaola (cecina de ternera)', 'Bresaola (bœuf séché)', 'Bresaola (Rinderschinken)', 'Bresaola (carne seca)']],
  ['tofu', 144, 17, 3, 9, 150, ['Tofu', 'Firm tofu', 'Tofu firme', 'Tofu ferme', 'Tofu (fest)', 'Tofu firme']],
  ['greek_yogurt', 59, 10, 3.6, 0.4, 170, ['Yogurt greco 0%', 'Greek yogurt 0%', 'Yogur griego 0%', 'Yaourt grec 0 %', 'Griechischer Joghurt 0 %', 'Iogurte grego 0%']],
  ['milk', 50, 3.3, 4.8, 2, 250, ['Latte parzialmente scremato', 'Semi-skimmed milk', 'Leche semidesnatada', 'Lait demi-écrémé', 'Fettarme Milch', 'Leite semidesnatado']],
  ['cottage_cheese', 98, 11, 3.4, 4.3, 150, ['Fiocchi di latte', 'Cottage cheese', 'Queso cottage', 'Cottage cheese', 'Hüttenkäse', 'Queijo cottage']],
  ['mozzarella', 250, 18, 1, 19, 125, ['Mozzarella', 'Mozzarella', 'Mozzarella', 'Mozzarella', 'Mozzarella', 'Muçarela']],
  ['whey', 380, 78, 8, 5, 30, ['Proteine whey in polvere', 'Whey protein powder', 'Proteína whey en polvo', 'Protéine whey en poudre', 'Whey-Proteinpulver', 'Whey protein em pó']],
  ['oats', 389, 17, 66, 7, 50, ['Fiocchi d\'avena', 'Rolled oats', 'Copos de avena', 'Flocons d\'avoine', 'Haferflocken', 'Aveia em flocos']],
  ['cornflakes', 357, 7.5, 84, 0.4, 40, ['Corn flakes', 'Corn flakes', 'Copos de maíz', 'Corn flakes', 'Cornflakes', 'Flocos de milho']],
  ['pasta_dry', 371, 13, 75, 1.5, 80, ['Pasta (cruda)', 'Pasta (dry)', 'Pasta (en seco)', 'Pâtes (crues)', 'Nudeln (roh)', 'Massa (crua)']],
  ['rice_dry', 360, 7, 79, 0.6, 80, ['Riso (crudo)', 'Rice (dry)', 'Arroz (en crudo)', 'Riz (cru)', 'Reis (roh)', 'Arroz (cru)']],
  ['rice_cooked', 130, 2.7, 28, 0.3, 200, ['Riso (cotto)', 'Rice (cooked)', 'Arroz (cocido)', 'Riz (cuit)', 'Reis (gekocht)', 'Arroz (cozido)']],
  ['quinoa', 120, 4.4, 21, 1.9, 150, ['Quinoa (cotta)', 'Quinoa (cooked)', 'Quinoa (cocida)', 'Quinoa (cuit)', 'Quinoa (gekocht)', 'Quinoa (cozida)']],
  ['bread_wholewheat', 247, 13, 41, 3.4, 60, ['Pane integrale', 'Whole-wheat bread', 'Pan integral', 'Pain complet', 'Vollkornbrot', 'Pão integral']],
  ['bread_white', 265, 9, 49, 3.2, 60, ['Pane bianco', 'White bread', 'Pan blanco', 'Pain blanc', 'Weißbrot', 'Pão branco']],
  ['rice_cakes', 387, 8, 81, 3, 20, ['Gallette di riso', 'Rice cakes', 'Tortitas de arroz', 'Galettes de riz', 'Reiswaffeln', 'Bolachas de arroz']],
  ['potato', 87, 1.9, 20, 0.1, 200, ['Patate (bollite)', 'Potatoes (boiled)', 'Patatas (cocidas)', 'Pommes de terre (cuites)', 'Kartoffeln (gekocht)', 'Batatas (cozidas)']],
  ['sweet_potato', 90, 2, 21, 0.2, 200, ['Patate dolci (al forno)', 'Sweet potato (baked)', 'Boniato (asado)', 'Patate douce (au four)', 'Süßkartoffel (gebacken)', 'Batata-doce (assada)']],
  ['lentils', 116, 9, 20, 0.4, 150, ['Lenticchie (cotte)', 'Lentils (cooked)', 'Lentejas (cocidas)', 'Lentilles (cuites)', 'Linsen (gekocht)', 'Lentilhas (cozidas)']],
  ['chickpeas', 164, 8.9, 27, 2.6, 150, ['Ceci (cotti)', 'Chickpeas (cooked)', 'Garbanzos (cocidos)', 'Pois chiches (cuits)', 'Kichererbsen (gekocht)', 'Grão-de-bico (cozido)']],
  ['broccoli', 34, 2.8, 7, 0.4, 150, ['Broccoli', 'Broccoli', 'Brócoli', 'Brocoli', 'Brokkoli', 'Brócolis']],
  ['salad', 15, 1.4, 2.9, 0.2, 100, ['Insalata mista', 'Mixed salad', 'Ensalada mixta', 'Salade verte', 'Gemischter Salat', 'Salada mista']],
  ['tomato', 18, 0.9, 3.9, 0.2, 150, ['Pomodori', 'Tomatoes', 'Tomates', 'Tomates', 'Tomaten', 'Tomates']],
  ['banana', 89, 1.1, 23, 0.3, 120, ['Banana', 'Banana', 'Plátano', 'Banane', 'Banane', 'Banana']],
  ['apple', 52, 0.3, 14, 0.2, 150, ['Mela', 'Apple', 'Manzana', 'Pomme', 'Apfel', 'Maçã']],
  ['orange', 47, 0.9, 12, 0.1, 150, ['Arancia', 'Orange', 'Naranja', 'Orange', 'Orange', 'Laranja']],
  ['blueberries', 57, 0.7, 14, 0.3, 100, ['Mirtilli', 'Blueberries', 'Arándanos', 'Myrtilles', 'Heidelbeeren', 'Mirtilos']],
  ['avocado', 160, 2, 9, 15, 100, ['Avocado', 'Avocado', 'Aguacate', 'Avocat', 'Avocado', 'Abacate']],
  ['almonds', 579, 21, 22, 50, 30, ['Mandorle', 'Almonds', 'Almendras', 'Amandes', 'Mandeln', 'Amêndoas']],
  ['peanut_butter', 588, 25, 20, 50, 20, ['Burro di arachidi', 'Peanut butter', 'Crema de cacahuete', 'Beurre de cacahuète', 'Erdnussbutter', 'Pasta de amendoim']],
  ['olive_oil', 884, 0, 0, 100, 10, ['Olio extravergine d\'oliva', 'Extra virgin olive oil', 'Aceite de oliva virgen extra', 'Huile d\'olive vierge extra', 'Natives Olivenöl extra', 'Azeite extravirgem']],
  ['dark_chocolate', 598, 7.8, 46, 43, 20, ['Cioccolato fondente 70%', 'Dark chocolate 70%', 'Chocolate negro 70%', 'Chocolat noir 70 %', 'Zartbitterschokolade 70 %', 'Chocolate amargo 70%']],
  ['honey', 304, 0.3, 82, 0, 20, ['Miele', 'Honey', 'Miel', 'Miel', 'Honig', 'Mel']],
  ['orange_juice', 45, 0.7, 10, 0.2, 200, ['Spremuta d\'arancia', 'Orange juice', 'Zumo de naranja', 'Jus d\'orange', 'Orangensaft', 'Suco de laranja']],
  ['pizza_margherita', 250, 10, 31, 9, 300, ['Pizza margherita', 'Margherita pizza', 'Pizza margarita', 'Pizza margherita', 'Pizza Margherita', 'Pizza margherita']]
];

export const FOODS = RAW.map(([id, kcal, p, c, f, serving, names]) => ({
  id, kcal, p, c, f, serving,
  name: Object.fromEntries(LANGS.map((l, i) => [l, names[i]]))
}));

export const FOOD_BY_ID = Object.fromEntries(FOODS.map(f => [f.id, f]));
