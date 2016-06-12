import angular from 'angular';
import About from './about/about';
import Home from './home/home';

import ACT from './act/act';
import NSW from './nsw/nsw';
import NT from './nt/nt';
import QLD from './qld/qld';
import SA from './sa/sa';
import TAS from './tas/tas';
import VIC from './vic/vic';
import WA from './wa/wa';

// ensure any new pages in /client/app/pages are added here
let pageModule = angular.module('app.pages', [
  About.name,
  Home.name,
  ACT.name,
  NSW.name,
  NT.name,
  QLD.name,
  SA.name,
  TAS.name,
  VIC.name,
  WA.name
]);

export default pageModule;
