import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './shared/layout/layout.component';
import { ComingSoonPageComponent } from './pages/others/coming-soon/coming-soon.component';
import { IndexComponent } from './pages/home/index/index.component';
import { CartComponent } from './pages/shop/cart/cart.component';
import { CheckoutComponent } from './pages/shop/checkout/checkout.component';
import { ThankyouComponent } from './pages/others/thankyou/thankyou.component';

const routes: Routes = [
	{
		path: 'pages/coming-soon',
		component: ComingSoonPageComponent
	},
	{
		path: '',
		component: LayoutComponent,
		children: [
			{
				path: '',
				pathMatch: 'full',
				component: IndexComponent
			},
			// {
			// 	path: 'elements',
			// 	loadChildren: () => import( './pages/elements/elements.module' ).then( m => m.ElementsModule )
			// },
			// {
			// 	path: 'blog',
			// 	loadChildren: () => import( './pages/blog/blog.module' ).then( m => m.BlogModule )
			// },
			{
				path: 'pages',
				loadChildren: () => import( './pages/others/pages.module' ).then( m => m.PagesModule )
			},
			{
				path: 'cart',
				component: CartComponent, data: { breadcrumb: 'Cart' } 
			},
			{
				path: 'checkout',
				component: CheckoutComponent, data: { breadcrumb: 'Checkout' } 
			},
			{
				path: 'catalogue',
				loadChildren: () => import( './pages/shop/shop.module' ).then( m => m.ShopModule )
			},
			{
				path: ':category',
				loadChildren: () => import( './pages/product/product.module' ).then( m => m.ProductModule )
			},
		]
	},
	{
		path: '**',
		redirectTo: '/pages/404'
	}
];

@NgModule( {
	imports: [ RouterModule.forRoot( routes, { useHash: false, anchorScrolling: 'disabled', scrollPositionRestoration: 'disabled' } ) ],
	exports: [ RouterModule ]
} )

export class AppRoutingModule { }