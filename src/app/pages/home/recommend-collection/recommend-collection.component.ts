import { Component, OnInit, Input } from '@angular/core';

import { productSlider } from '../data';

@Component({
  selector: 'molla-recommend-collection',
  templateUrl: './recommend-collection.component.html',
  styleUrls: ['./recommend-collection.component.scss']
})
export class RecommendCollectionComponent implements OnInit {

  @Input() products = [];
  @Input() loaded = false;

	sliderOption = productSlider;

  constructor() { }

  ngOnInit(): void {
  }
}
