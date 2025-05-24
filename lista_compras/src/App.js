import './App.css';
import { useState } from 'react';

function SearchBar({ filterText, inStockOnly, onFilterTextChange, onInStockChange }) {
  return (
    <form>
      <input
        type="text"
        placeholder="Buscar..."
        value={filterText}
        onChange={e => onFilterTextChange(e.target.value)}
      />
      <label>
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={e => onInStockChange(e.target.checked)}
        /> Mostrar solo productos en stock
      </label>
    </form>
  );
}

function ProductTable({ products, filterText, inStockOnly }) {
  const groupedProducts = products.reduce((acc, product) => {
    if (
      product.name.toLowerCase().includes(filterText.toLowerCase()) &&
      (!inStockOnly || product.stocked)
    ) {
      if (!acc[product.category]) {
        acc[product.category] = [];
      }
      acc[product.category].push(product);
    }
    return acc;
  }, {});

  return (
    <>
      {Object.entries(groupedProducts).map(([category, items]) => (
        <div
          key={category}
          className="categoria"
          id={`categoria${category}`}
        >
          <h4>{category}</h4>
          <ul id={`categoria${category}List`}>
            {items.map(item => (
              <li key={item.name}>
                <article>
                  {item.name} - {item.price}
                  {!item.stocked && " (No disponible)"}
                </article>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}

function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <section className="section categorias" id="productosSection">
      <h2>Productos</h2>
      <SearchBar
        filterText={filterText}
        inStockOnly={inStockOnly}
        onFilterTextChange={setFilterText}
        onInStockChange={setInStockOnly}
      />
      <ProductTable products={products} filterText={filterText} inStockOnly={inStockOnly} />
    </section>
  );
}

function Formulario() {
  return (
    <section className="section formulario">
      <h2>Agregar Producto</h2>
      <form id="form-add-product">
        <label htmlFor="nombre">Producto:</label>
        <input type="text" id="nombre" required />

        <label htmlFor="cantidad">Cantidad:</label>
        <input
          type="number"
          id="cantidad"
          name="cantidad"
          min="1"
          placeholder="Ingresa la cantidad"
          required
        />

        <label htmlFor="categoria">Categoría:</label>
        <select id="categoria" name="categoria" required>
          <option value="" disabled>
            Selecciona una...
          </option>
          <option value="categoriaLacteos">Lácteos</option>
          <option value="categoriaCarnes">Carnes</option>
          <option value="categoriaVerduras">Verduras</option>
          <option value="categoriaFrutas">Frutas</option>
          <option value="categoriaPanaderia">Panadería</option>
          <option value="categoriaBebidas">Bebidas</option>
        </select>
        <button type="submit">Agregar Producto</button>
      </form>
      <Animation$ />
    </section>
  );
}

function ListaCompras() {
  return (
    <section className="section shopping">
      <h2>Lista de Compras</h2>
      <ul className="shopping-list">
        <li>Producto A - 2 unidades</li>
      </ul>
    </section>
  );
}

const PRODUCTS = [
  { category: "Lacteos", price: "$2", stocked: true, name: "Leche" },
  { category: "Carnes", price: "$5", stocked: true, name: "Pollo" },
  { category: "Verduras", price: "$2", stocked: true, name: "Zanahorias" },
  { category: "Verduras", price: "$2", stocked: true, name: "Espinaca" },
  { category: "Verduras", price: "$4", stocked: false, name: "Calabaza" },
  { category: "Verduras", price: "$1", stocked: true, name: "Guisantes" },
  { category: "Frutas", price: "$1", stocked: true, name: "Manzana" },
  { category: "Frutas", price: "$1", stocked: true, name: "Fruta del dragón" },
  { category: "Frutas", price: "$2", stocked: false, name: "Maracuyá" },
  { category: "Frutas", price: "$1", stocked: true, name: "Manzanas" },
  { category: "Panaderia", price: "$3", stocked: true, name: "Pan Integral" },
  { category: "Bebidas", price: "$2", stocked: true, name: "Jugo de Naranja" },
];

export default function App() {
  return (
    <div className="container-padre">
      <FilterableProductTable products={PRODUCTS} />
      <Formulario />
      <ListaCompras />
    </div>
  );
}

function Animation$() {
  return (
    <section className="cont">
      <section className="left-side">
        <section className="card">
          <div className="card-line"></div>
          <div className="buttons"></div>
        </section>
        <section className="post">
          <div className="post-line"></div>
          <div className="screen">
            <div className="dollar">$</div>
          </div>
          <div className="numbers"></div>
          <div className="numbers-line2"></div>
        </section>
      </section>
      <section className="right-side"></section>
    </section>
  );
}

