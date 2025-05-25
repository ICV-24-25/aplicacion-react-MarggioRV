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
function ProductTable({ products, criterioOrden }) {
  if (criterioOrden === 'categoría') {
    const groupedProducts = products.reduce((acc, product) => {
      if (!acc[product.category]) acc[product.category] = [];
      acc[product.category].push(product);
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
            const bgColor = categoryColors[category] || 'white';
            return items.map((item, index) => (
              <tr key={`${category}-${item.name}`}>
                {index === 0 ? (
                  <td className="categoria" style={{ backgroundColor: bgColor }}>
                    {category}
                  </td>
                ) : (
                  <td style={{ backgroundColor: bgColor }}></td>
                )}
                <td style={{ backgroundColor: bgColor, color: item.stocked ? 'black' : 'red' }}>
                  {item.name}
                  {!item.stocked && " (No disponible)"}
                </td>
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

  // Cuando no se agrupa por categoría: fondo gris
  return (
    <table className="product-table">
      <colgroup>
        <col className="col-50" />
        <col className="col-50" />
      </colgroup>
      <thead>
        <tr>
          <th>Producto</th>
          <th>Precio</th>
        </tr>
      </thead>
      <tbody>
        {products.map((item) => (
          <tr key={item.name} style={{ backgroundColor: '#8A9597' }}>
            <td style={{ color: item.stocked ? 'black' : 'red' }}>
              {item.name}
              {!item.stocked && " (No disponible)"}
            </td>
            <td style={{ color: item.stocked ? 'black' : 'red' }}>
              {item.price}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [criterioOrden, setCriterioOrden] = useState('categoría'); // Categoría, la opción, marcada por defecto
  const [categoriasVisibles, setCategoriasVisibles] = useState({}); // Control de visibilidad

  // Al cargar productos, activar todas las categorías
  useEffect(() => {
    const nuevasCategorias = [...new Set(products.map(p => p.category))];
    const estadoInicial = nuevasCategorias.reduce((acc, cat) => {
      acc[cat] = true; // todas visibles por defecto
      return acc;
    }, {});
    setCategoriasVisibles(estadoInicial);
  }, [products]); // se ejecuta solo cuando los productos cambian

// Función para alternar visibilidad
  const toggleCategoriaVisible = (categoria) => {setCategoriasVisibles(prev => ({
      ...prev,
      [categoria]: !prev[categoria]
    }));
  };

  const precioANumero = (precioStr) => parseFloat(precioStr.replace('$', ''));

  // filtra si la categoría está visible.
  let productosFiltrados = products.filter(product =>
    product.name.toLowerCase().includes(filterText.toLowerCase()) &&
    (!inStockOnly || product.stocked) &&
    categoriasVisibles[product.category]
  );

   // Ordenamiento según...
  if (criterioOrden === 'nombre') {
    productosFiltrados.sort((a, b) => a.name.localeCompare(b.name));
  } else if (criterioOrden === 'precio') {
    productosFiltrados.sort((a, b) => precioANumero(a.price) - precioANumero(b.price));
  }

  const categoriasUnicas = [...new Set(products.map(p => p.category))];

  return (
    <section className="section categorias" id="productosSection">
      <h2>Productos</h2>
      <SearchBar
        filterText={filterText}
        inStockOnly={inStockOnly}
        onFilterTextChange={setFilterText}
        onInStockChange={setInStockOnly}
      />

      {/* Selector de orden */}
      <label>
        Ordenar por:{' '}
        <select value={criterioOrden} onChange={e => setCriterioOrden(e.target.value)}>
          <option value="categoría">Categoría</option>
          <option value="nombre">Nombre</option>
          <option value="precio">Precio</option>
        </select>
      </label>

      {/* Botones para mostrar/ocultar categorías */}
      <div style={{ marginTop: '10px', marginBottom: '10px' }}>
        {categoriasUnicas.map(categoria => (
          <button
            key={categoria}
            style={{
              marginRight: '8px',
              backgroundColor: categoriasVisibles[categoria] ? '#4CAF50' : '#f44336',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              cursor: 'pointer',
              borderRadius: '4px',
            }}
            onClick={() => toggleCategoriaVisible(categoria)}
            type="button"
          >
            {categoriasVisibles[categoria] ? `Ocultar ${categoria}` : `Mostrar ${categoria}`}
          </button>
        ))}
      </div>

      <ProductTable
        products={productosFiltrados}
        criterioOrden={criterioOrden}
      />
    </section>
  );
}


/*===Formulario (Cálculo y envío)===*/
function Formulario({ products, onAgregarCompra }) {
  const [nombre, setNombre] = useState('');
  const [cantidad, setCantidad] = useState(1);

  // Lógica cuando se envía el formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    const producto = products.find(p => p.name.toLowerCase() === nombre.toLowerCase());

    if (!producto) {
      alert('Producto no encontrado');
      return;
    }

    const precioNumerico = parseFloat(producto.price.replace('$', ''));
    const total = precioNumerico * cantidad;

    // Llama a la función del padre para agregarlo a la lista
    onAgregarCompra({
      nombre: producto.name,
      cantidad,
      total: `$${total.toFixed(2)}`
    });

    // Limpiar el formulario
    setNombre('');
    setCantidad(1);
  };

  return (
    <section className="section formulario">
      <h2>Agregar Producto</h2>
      <form id="form-add-product" className="valy" onSubmit={handleSubmit}>
        {/* Nombre del producto */}
        <label htmlFor="nombre">Producto:</label>
        <input
          type="text"
          id="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        {/* Cantidad */}
        <label htmlFor="cantidad">Cantidad:</label>
        <input
          type="number"
          id="cantidad"
          name="cantidad"
          min="1"
          value={cantidad}
          onChange={(e) => setCantidad(Number(e.target.value))}
          required
        />

        <button type="submit">Agregar Producto</button>
      </form>
      <Animation />
    </section>
  );
}

/*===Lista de Compras con items agregados===*/
function ListaCompras({ compras }) {
  // Calcular total general
  const totalGeneral = compras.reduce((acc, item) => {
    const num = parseFloat(item.total.replace('$', ''));
    return acc + num;
  }, 0);

  return (
    <section className="section shopping">
      <h2>Lista de Compras</h2>
      <ul className="shopping-list">
        {compras.map((item, index) => (
          <li className="compra-item" key={index}>
            <span className="producto">{item.nombre}</span>
            <span className="cantidad">Cantidad: {item.cantidad}</span>
            <span className="total">Total: {item.total}</span>
          </li>
        ))}
      </ul>
      <hr />
      <section className="total-general">
        <strong>Total: ${totalGeneral.toFixed(2)}</strong>
      </section>
    </section>
  );
}

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

/*===App Principal con estado de compras===*/
export default function App() {
  const [products, setProducts] = useState([]);
  const [compras, setCompras] = useState([]); // Lista de compras

  useEffect(() => {
    fetch('/productos.json')
      .then(response => {
        if (!response.ok) throw new Error('Error al cargar los productos');
        return response.json();
      })
      .then(data => setProducts(data))
      .catch(error => console.error('Error al obtener los productos:', error));
  }, []);

  // Agrega un producto a la lista de compras
  const handleAgregarCompra = (item) => {
    setCompras(prev => [...prev, item]);
  };

  return (
    <div className="container-padre">
      <FilterableProductTable products={products} />
      <Formulario products={products} onAgregarCompra={handleAgregarCompra} />
      <ListaCompras compras={compras} />
    </div>
  );
}