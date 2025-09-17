import { Routes } from '@angular/router';
import { Holamundo } from './pages/holamundo/holamundo';
import { PruebasComponent } from './component/pruebas/pruebas.component';
import { TaskComponent } from './pages/task/task.component';
import { DatapickerComponent } from './pages/datapicker/datapicker.component';
import { HomeworkComponent } from './pages/homework/homework.component';
import { PersonaPage } from './features/personas/pages/persona/persona';
import { ProductoPage } from './features/productos/pages/producto/producto';
export const routes: Routes = [
  {
    path: 'holamundo',
    component: Holamundo,
  },
  {
    path: 'pruebas',
    component: PruebasComponent,
  },
  { path: 'picker', component: DatapickerComponent },
  { path: 'tarea', component: HomeworkComponent },
  {
    path: '',
    component: TaskComponent,
  },
  { path: 'persona', component: PersonaPage },
  { path: 'producto', component: ProductoPage },
];
