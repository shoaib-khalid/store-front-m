import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OwlModule } from 'angular-owl-carousel';

import { SharedModule } from '../../shared/shared.module';

import { IndexComponent } from './index/index.component';
import { TrendyCollectionComponent } from './trendy-collection/trendy-collection.component';
import { BlogCollectionComponent } from './blog-collection/blog-collection.component';
import { RecommendCollectionComponent } from './recommend-collection/recommend-collection.component';

@NgModule({
	declarations: [
		IndexComponent,
		TrendyCollectionComponent,
		BlogCollectionComponent,
		RecommendCollectionComponent
	],

	imports: [
		CommonModule,
		RouterModule,
		NgbModule,
		OwlModule,
		SharedModule
	]
})

export class HomeModule { }
