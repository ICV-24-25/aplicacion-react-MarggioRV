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
function SearchBar({
  filterText,
  inStockOnly,
  onFilterTextChange,
  onInStockChange,
  criterioOrden,
  onCriterioOrdenChange,
  filtrarFavoritos,
  onFiltrarFavoritosChange
}) {
  return (

    <nav className="search">

      <input
        className="search-input"
        type="text"
        placeholder="Buscar..."
        value={filterText}
        onChange={e => onFilterTextChange(e.target.value)}/>

      <label style={{ marginLeft: '1em' }}>
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={e => onInStockChange(e.target.checked)}/> Mostrar en stock
      </label>

      <label className="label-neon" style={{ marginLeft: '1em' }}>
        Ordenar por:{' '}
        
        <select id="sort-select" className="select-neon" value={criterioOrden} onChange={e => onCriterioOrdenChange(e.target.value)}>
          <option value="categoría">Categoría</option>
          <option value="nombre">Nombre</option>
          <option value="precio">Precio</option>
        </select>
      </label>

      {/* Estrella para filtrar favoritos */}
<i className={`estrella-icono fa-star ${filtrarFavoritos ? 'fa-solid' : 'fa-regular'}`}
   onClick={onFiltrarFavoritosChange}
   title={filtrarFavoritos ? "Mostrar todos" : "Mostrar solo favoritos"}
   aria-label="Filtrar solo favoritos"/>


</nav>);}

/*===ProductTable===*/

/* La nueva estrella se verá junto al name, "☆", siendo invisble hasta pasar el ratón. 
Su estado activado "⭐" */

function ProductTable({ products, criterioOrden, favoritos, onToggleFavorito }) {
  // Si el criterio es 'categoría', agrupamos los productos por su categoría
  if (criterioOrden === 'categoría') {
    // Agrupación: crea un objeto con claves como categorías y valores como arrays de productos
    const groupedProducts = products.reduce((acc, product) => {
      if (!acc[product.category]) acc[product.category] = [];
      acc[product.category].push(product);
      return acc;
    }, {});

    const totalProductos = products.length; // Total visibles (ya filtrados)

    return (<>
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
            {Object.entries(groupedProducts).map(([category, items]) =>
              items.map((item, index) => {
                const bgColor = categoryColors[category] || 'white';

                return (
                  <tr key={`${category}-${item.name}`}>
                    {index === 0 ? (
                      <td
                        className="categoria"
                        style={{
                          backgroundColor: bgColor,
                          transition: 'background-color 0.3s ease',
                        }}>
                        {category}
                      </td>
                    ) : (
                      <td style={{ backgroundColor: bgColor }}></td>
                    )}
                    <td
                      style={{
                        backgroundColor: bgColor,
                        color: item.stocked ? 'black' : 'red',
                        position: 'relative',
                        cursor: 'default',
                        transition: 'color 0.3s ease',
                      }}>
                      {item.name}
                  {/* Span, ahi, la star*/}
                  <span className='star'
                        onClick={(e) => {
                      e.stopPropagation(); // Evita que el click se propague a la fila o al padre
                      onToggleFavorito(item.name); // Llama función para marcar/desmarcar favorito
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                        onMouseLeave={(e) => {
                      // Al quitar el ratón, si el producto no es favorito, oculta la estrella
                          if (!favoritos.includes(item.name)) e.currentTarget.style.opacity = 0;
                        }}
                        title={
                          favoritos.includes(item.name)
                            ? 'Quitar de favoritos'
                            : 'Agregar a favoritos'
                        }>
                        {favoritos.includes(item.name) ? '⭐' : '☆'}
                      </span>
                    </td>
                    <td style={{ backgroundColor: bgColor, color: item.stocked ? 'black' : 'red' }}>
                      {item.price}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        {/* Mostrar texto con cantidad visible y total */}
        <p style={{ marginTop: '1em', fontStyle: 'italic' }}>
          Mostrando {totalProductos} productos
        </p>
      </>
    );
  }

  // Tabla simple para otros criterios
  const totalProductos = products.length;

  return (
    <>
      <table className="product-table">
        <colgroup>
          <col className="col-50"/>
          <col className="col-50"/>
        </colgroup>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
          </tr>
        </thead>
        <tbody>
        {/* Se productos sin agrupar */}
          {products.map((item) => (
            <tr key={item.name} style={{ backgroundColor: '#8A9597', transition: 'background-color 0.3s ease' }}>
              <td
                style={{
                color: item.stocked ? 'black' : 'red', // En caso de no estar en stock, el texto se vuelve rojo
                  position: 'relative',
                  cursor: 'default',
                  transition: 'color 0.3s ease',
                }}>
                {item.name}
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorito(item.name);
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                  onMouseLeave={(e) => {
                    if (!favoritos.includes(item.name)) e.currentTarget.style.opacity = 0;
                  }}
                  // Tooltip que indica la acción al usuario
                  title={favoritos.includes(item.name) ? 'Quitar de favoritos' : 'Agregar a favoritos'}>
                  {favoritos.includes(item.name) ? '⭐' : '☆'}
                </span>
              </td>
              <td style={{ color: item.stocked ? 'black' : 'red' }}>{item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ marginTop: '1em', fontStyle: 'italic' }}>
        Mostrando {totalProductos} productos
      </p>
    </>
  );
}


/*===FilterableProductTable===*/
function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState(''); // Texto de búsqueda
  const [inStockOnly, setInStockOnly] = useState(false); // Checkbox de stock
  const [criterioOrden, setCriterioOrden] = useState('categoría'); // Criterio de orden
  const [categoriasVisibles, setCategoriasVisibles] = useState({}); // Control de visibilidad
  const [favoritos, setFavoritos] = useState([]); // Array nombres favoritos
  const [filtrarFavoritos, setFiltrarFavoritos] = useState(false); // Filtro por favoritos

  // Al cargar productos, activar todas las categorías
  useEffect(() => {
    const nuevasCategorias = [...new Set(products.map((p) => p.category))];
    const estadoInicial = nuevasCategorias.reduce((acc, cat) => {
      acc[cat] = true; // Todas visibles por defecto
      return acc;
    }, {});
    setCategoriasVisibles(estadoInicial);
  }, [products]);

  // Toggle visibilidad de categoría
  const toggleCategoriaVisible = (categoria) => {
    setCategoriasVisibles((prev) => ({
      ...prev,
      [categoria]: !prev[categoria],
    }));
  };

  // Toggle producto favorito
  const toggleFavorito = (nombreProducto) => {
    setFavoritos((prev) =>
      prev.includes(nombreProducto)
        ? prev.filter((n) => n !== nombreProducto)
        : [...prev, nombreProducto]
    );
  };

  // Toggle filtro favoritos: (des)activado
  const toggleFiltrarFavoritos = () => {
    setFiltrarFavoritos((prev) => !prev);
  };

  const precioANumero = (precioStr) => parseFloat(precioStr.replace('$', ''));

  // Aplicar filtros de texto, stock, categoría visibles, y si filtrar favoritos está activo
  let productosFiltrados = products.filter(product =>
      product.name.toLowerCase().includes(filterText.toLowerCase()) &&
      (!inStockOnly || product.stocked) &&
      categoriasVisibles[product.category] &&
      (!filtrarFavoritos || favoritos.includes(product.name))
  );

  // Si filtro favoritos está activo y el criterio es nombre o precio, mostramos **todos los favoritos** sin importar categoría,
  // pero ordenados según criterio
  if (filtrarFavoritos && (criterioOrden === 'nombre' || criterioOrden === 'precio')) {
    productosFiltrados = products.filter((product) => favoritos.includes(product.name));

    if (criterioOrden === 'nombre') {
      productosFiltrados.sort((a, b) => a.name.localeCompare(b.name));
    } else if (criterioOrden === 'precio') {
      productosFiltrados.sort(
        (a, b) => precioANumero(a.price) - precioANumero(b.price)
      );
    }
  } else {
    // Orden normal
    if (criterioOrden === 'nombre') {
      productosFiltrados.sort((a, b) => a.name.localeCompare(b.name));
    } else if (criterioOrden === 'precio') {
      productosFiltrados.sort((a, b) => precioANumero(a.price) - precioANumero(b.price)
      );
    }
  }

  const categoriasUnicas = [...new Set(products.map((p) => p.category))];

  // Reinicia todos los filtros al estado inicial
  const resetearFiltros = () => {
    setFilterText('');
    setInStockOnly(false);
    setCriterioOrden('categoría');
    setFiltrarFavoritos(false);
    const categoriasIniciales = categoriasUnicas.reduce((acc, cat) => {
      acc[cat] = true;
      return acc;
    }, {});
    setCategoriasVisibles(categoriasIniciales);
    setFavoritos([]);
  };

  return (
    <section className="section categorias" id="productosSection">
      <h2>Productos</h2>

      {/* SearchBar recibe el estado y handler para filtrar favoritos */}
      <SearchBar
        filterText={filterText}
        inStockOnly={inStockOnly}
        onFilterTextChange={setFilterText}
        onInStockChange={setInStockOnly}
        criterioOrden={criterioOrden}
        onCriterioOrdenChange={setCriterioOrden}
        filtrarFavoritos={filtrarFavoritos}
        onFiltrarFavoritosChange={toggleFiltrarFavoritos}/>

      {/* Botones para mostrar/ocultar categorías */}
      <section className='categorias-botones'>
        {categoriasUnicas.map(categoria => (
          <button
            key={categoria}
            className={`categoria-b ${
              categoriasVisibles[categoria]
                ? 'categoria-activa'
                : 'categoria-inactiva'
            }`}
            onClick={() => toggleCategoriaVisible(categoria)}
            type="button"
            style={{
              transition: 'background-color 0.4s ease, color 0.4s ease',
            }}>
            {categoriasVisibles[categoria]
              ? `Ocultar ${categoria}`
              : `Mostrar ${categoria}`}
          </button>
        ))}
      </section>

      <button className="Reset" onClick={resetearFiltros} type="button">
        Restablecer filtros
      </button>


      <ProductTable
        products={productosFiltrados}
        criterioOrden={criterioOrden}
        favoritos={favoritos}
        onToggleFavorito={toggleFavorito}/>
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
          required/>

        {/* Cantidad */}
        <label htmlFor="cantidad">Cantidad:</label>
        <input
          type="number"
          id="cantidad"
          name="cantidad"
          min="1"
          value={cantidad}
          onChange={(e) => setCantidad(Number(e.target.value))}
          required/>

        <button type="submit">+ a Lista</button>
      </form>
      <Animation/>
    </section>
  );
}

/*===Lista de Compras con items agregados===*/
function ListaCompras({ compras }) {
  // Calcular total general
  const totalGeneral = compras.reduce((acc, item) => {
    const num = parseFloat(item.total.replace('$', ''));
    return acc + num;}, 0);

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
      <FilterableProductTable products={products}/>
      <Formulario products={products} onAgregarCompra={handleAgregarCompra} />
      <ListaCompras compras={compras}/>
    </div>
  );
}
