// import { useState } from 'react';
// import { motion } from 'motion/react';
// import { Search, Plus, Edit, Trash2, Package } from 'lucide-react';
// import { Input } from '../ui/input';
// import { Button } from '../ui/button';
// import { CategoryForm, CategoryFormData } from './CategoryForm';
// import { toast } from 'sonner@2.0.3';

// interface Category {
//   id: string;
//   name: string;
//   description: string;
//   color: string;
//   productsCount: number;
// }

// const mockCategories: Category[] = [
//   {
//     id: '1',
//     name: 'Electrónicos',
//     description: 'Dispositivos electrónicos y tecnología',
//     color: '#4f46e5',
//     productsCount: 45
//   },
//   {
//     id: '2',
//     name: 'Periféricos',
//     description: 'Accesorios y periféricos de computadora',
//     color: '#22c55e',
//     productsCount: 32
//   },
//   {
//     id: '3',
//     name: 'Componentes',
//     description: 'Componentes de hardware y repuestos',
//     color: '#f59e0b',
//     productsCount: 28
//   },
//   {
//     id: '4',
//     name: 'Accesorios',
//     description: 'Accesorios diversos para dispositivos',
//     color: '#3b82f6',
//     productsCount: 67
//   },
//   {
//     id: '5',
//     name: 'Audio',
//     description: 'Equipos y accesorios de audio',
//     color: '#8b5cf6',
//     productsCount: 23
//   },
//   {
//     id: '6',
//     name: 'Video',
//     description: 'Cámaras, webcams y equipos de video',
//     color: '#ec4899',
//     productsCount: 18
//   },
//   {
//     id: '7',
//     name: 'Redes',
//     description: 'Equipos de red y conectividad',
//     color: '#14b8a6',
//     productsCount: 15
//   },
//   {
//     id: '8',
//     name: 'Software',
//     description: 'Licencias y programas de software',
//     color: '#f97316',
//     productsCount: 12
//   }
// ];

// export function Categories() {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [categories, setCategories] = useState<Category[]>(mockCategories);
//   const [formOpen, setFormOpen] = useState(false);
//   const [editingCategory, setEditingCategory] = useState<CategoryFormData | undefined>(undefined);

//   const handleAddCategory = () => {
//     setEditingCategory(undefined);
//     setFormOpen(true);
//   };

//   const handleEditCategory = (category: Category) => {
//     setEditingCategory({
//       id: category.id,
//       name: category.name,
//       description: category.description,
//       color: category.color
//     });
//     setFormOpen(true);
//   };

//   const handleDeleteCategory = (id: string) => {
//     const category = categories.find(c => c.id === id);
//     if (category && category.productsCount > 0) {
//       toast.error(`No se puede eliminar la categoría "${category.name}" porque tiene ${category.productsCount} productos asociados`);
//       return;
//     }
    
//     if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
//       setCategories(categories.filter(c => c.id !== id));
//       toast.success('Categoría eliminada exitosamente');
//     }
//   };

//   const handleSaveCategory = (data: CategoryFormData) => {
//     if (data.id) {
//       // Edit existing category
//       setCategories(categories.map(c =>
//         c.id === data.id
//           ? {
//               ...c,
//               name: data.name,
//               description: data.description,
//               color: data.color
//             }
//           : c
//       ));
//       toast.success('Categoría actualizada exitosamente');
//     } else {
//       // Add new category
//       const newCategory: Category = {
//         id: (categories.length + 1).toString(),
//         name: data.name,
//         description: data.description,
//         color: data.color,
//         productsCount: 0
//       };
//       setCategories([...categories, newCategory]);
//       toast.success('Categoría creada exitosamente');
//     }
//   };

//   const filteredCategories = categories.filter(category =>
//     category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     category.description.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const totalProducts = categories.reduce((sum, cat) => sum + cat.productsCount, 0);

//   return (
//     <div className="p-6 space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h1 className="text-3xl mb-2">Categorías</h1>
//           <p className="text-muted-foreground">
//             Gestiona las categorías de tus productos
//           </p>
//         </div>
//         <Button
//           className="rounded-xl"
//           style={{ backgroundColor: '#4f46e5' }}
//           onClick={handleAddCategory}
//         >
//           <Plus className="w-4 h-4 mr-2" />
//           Nueva Categoría
//         </Button>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-card border border-border rounded-2xl p-6"
//         >
//           <div className="flex items-center gap-3 mb-3">
//             <div
//               className="w-10 h-10 rounded-xl flex items-center justify-center"
//               style={{ backgroundColor: '#4f46e515' }}
//             >
//               <Package className="w-5 h-5" style={{ color: '#4f46e5' }} />
//             </div>
//             <p className="text-sm text-muted-foreground">Total Categorías</p>
//           </div>
//           <p className="text-2xl">{categories.length}</p>
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//           className="bg-card border border-border rounded-2xl p-6"
//         >
//           <div className="flex items-center gap-3 mb-3">
//             <div
//               className="w-10 h-10 rounded-xl flex items-center justify-center"
//               style={{ backgroundColor: '#22c55e15' }}
//             >
//               <Package className="w-5 h-5" style={{ color: '#22c55e' }} />
//             </div>
//             <p className="text-sm text-muted-foreground">Total Productos</p>
//           </div>
//           <p className="text-2xl">{totalProducts}</p>
//         </motion.div>
//       </div>

//       {/* Search */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.2 }}
//         className="bg-card border border-border rounded-2xl p-4"
//       >
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//           <Input
//             type="search"
//             placeholder="Buscar categorías..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="pl-10 rounded-xl bg-accent/50 border-0"
//           />
//         </div>
//       </motion.div>

//       {/* Categories Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredCategories.map((category, index) => (
//           <motion.div
//             key={category.id}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3 + index * 0.05 }}
//             className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all group"
//           >
//             <div className="flex items-start justify-between mb-4">
//               <div className="flex items-center gap-3 flex-1">
//                 <div
//                   className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0"
//                   style={{ backgroundColor: category.color }}
//                 >
//                   {category.name.charAt(0).toUpperCase()}
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <h3 className="text-lg mb-1 truncate">{category.name}</h3>
//                   <p className="text-sm text-muted-foreground line-clamp-2">
//                     {category.description}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="flex items-center justify-between pt-4 border-t border-border">
//               <div className="flex items-center gap-2">
//                 <Package className="w-4 h-4 text-muted-foreground" />
//                 <span className="text-sm text-muted-foreground">
//                   {category.productsCount} productos
//                 </span>
//               </div>

//               <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                 <button
//                   className="p-2 hover:bg-accent rounded-lg transition-colors"
//                   onClick={() => handleEditCategory(category)}
//                 >
//                   <Edit className="w-4 h-4" />
//                 </button>
//                 <button
//                   className="p-2 hover:bg-accent rounded-lg transition-colors text-destructive"
//                   onClick={() => handleDeleteCategory(category.id)}
//                 >
//                   <Trash2 className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>
//           </motion.div>
//         ))}
//       </div>

//       {/* Empty State */}
//       {filteredCategories.length === 0 && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="text-center py-12"
//         >
//           <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
//           <p className="text-lg text-muted-foreground">No se encontraron categorías</p>
//           <p className="text-sm text-muted-foreground mt-2">
//             Intenta ajustar tu búsqueda o crea una nueva categoría
//           </p>
//         </motion.div>
//       )}

//       {/* Category Form Modal */}
//       <CategoryForm
//         open={formOpen}
//         onClose={() => setFormOpen(false)}
//         onSave={handleSaveCategory}
//         initialData={editingCategory}
//       />
//     </div>
//   );
// }
