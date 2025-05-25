import './App.css';
import { useState, useEffect } from 'react';

// Diccionario: Colores x categoría 
const categoryColors = {
  'Lácteos': '#87CEEB',
  'Carnes': '#E75480',
  'Verduras': '#88E788',
  'Frutas': '#32CD32',
  'Panadería': '#fce5cd',
  'Bebidas': '#00AAE4'
};

/*===SearchBar===*/
function SearchBar({ filterText, inStockOnly, onFilterTextChange, onInStockChange }) {
  return (
    <form>
      {/* Input de búsqueda */}
      <input
        type="text"
        placeholder="Buscar..."
        value={filterText}
        onChange={e => onFilterTextChange(e.target.value)}
      />
      {/* Checkbox para mostrar solo productos en stock */}
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

/*===ProductTable===*/
function ProductTable({ products, filterText, inStockOnly }) {
  // Agrupa los productos por categoría si coinciden con el filtro
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
    <table className="product-table">
      <colgroup>
        <col className="col-30" />
        <col className="col-50" />
        <col className="col-20" />
      </colgroup>
      <thead>
        <tr>
          <th>Categoría</th>
          <th>Producto</th>
          <th>Precio</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(groupedProducts).map(([category, items]) => {
          const bgColor = categoryColors[category] || 'white'; // Color de fondo por categoría
          return items.map((item, index) => (
            <tr key={`${category}-${item.name}`}>
              {/* Solo muestra el nombre de la categoría en la primera fila */}
              {index === 0 ? (
                <td className="categoria" style={{ backgroundColor: bgColor }}>
                  {category}
                </td>
              ) : (
                <td style={{ backgroundColor: bgColor }}></td>
              )}
              {/* Producto */}
              <td style={{ backgroundColor: bgColor, color: item.stocked ? 'black' : 'red' }}>
                {item.name}
                {!item.stocked && " (No disponible)"}
              </td>
              {/* Precio */}
              <td style={{ backgroundColor: bgColor, color: item.stocked ? 'black' : 'red' }}>
                {item.price}
              </td>
            </tr>
          ));
        })}
      </tbody>
    </table>
  );
}

/*===FilterableProductTable===*/
function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState(''); // Texto de búsqueda
  const [inStockOnly, setInStockOnly] = useState(false); // Checkbox de stock

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

/*===Formulario===*/
function Formulario() {
  return (
    <section className="section formulario">
      <h2>Agregar Producto</h2>
      <form id="form-add-product" className="valy">
        {/* Nombre del producto */}
        <label htmlFor="nombre">Producto:</label>
        <input type="text" id="nombre" required />

        {/* Cantidad */}
        <label htmlFor="cantidad">Cantidad:</label>
        <input
          type="number"
          id="cantidad"
          name="cantidad"
          min="1"
          placeholder="Ingresa la cantidad"
          required
        />

        {/* Categoría */}
        <label htmlFor="categoria">Categoría:</label>
        <select id="categoria" name="categoria" required>
          <option value="" disabled>Selecciona una...</option>
          <option value="categoriaLacteos">Lácteos</option>
          <option value="categoriaCarnes">Carnes</option>
          <option value="categoriaVerduras">Verduras</option>
          <option value="categoriaFrutas">Frutas</option>
          <option value="categoriaPanaderia">Panadería</option>
          <option value="categoriaBebidas">Bebidas</option>
        </select>

        {/* Botón de enviar */}
        <button type="submit">Agregar Producto</button>
      </form>
      <Animation />
    </section>
  );
}

/*===Lista de Compras===*/
function ListaCompras() {
  return (
    <section className="section shopping">
      <h2>Lista de Compras</h2>
      <ul className="shopping-list">
        {/* Aquí se añadirán los productos de compra */}
        <li></li>
      </ul>
    </section>
  );
}

/*Bueno, aqui ibaa el array de los prodcuto, el cost*/

/*===Animación===*/
function Animation() {
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

/*===App Principal===*/
export default function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/productos.json')
      .then(response => {
        if (!response.ok) throw new Error('Error al cargar los productos');
        return response.json();
      })
      .then(data => setProducts(data))
      .catch(error => console.error('Error al obtener los productos:', error));
  }, []);

  return (
    <div className="container-padre">
      <FilterableProductTable products={products} />
      <Formulario />
      <ListaCompras />
    </div>
  );
}
