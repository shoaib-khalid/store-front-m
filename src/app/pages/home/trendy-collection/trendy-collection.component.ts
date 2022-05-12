import { Component, OnInit, Input } from '@angular/core';

import { productSlider } from '../data';

@Component({
  selector: 'molla-trendy-collection',
  templateUrl: './trendy-collection.component.html',
  styleUrls: ['./trendy-collection.component.scss']
})
export class TrendyCollectionComponent implements OnInit {

  @Input() products = [];
  @Input() loaded = false;

	sliderOption = productSlider;

  constructor() { }

  ngOnInit(): void {
  }

}
