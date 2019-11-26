import { State } from '@/State';
import { Element, ElementType } from '@/Element';

type StateToSvg = (svgContainer: SVGElement, stateToSvgMapper: SVGElementsCreator) => StateToSvgChanger;

export type StateToSvgChanger = (state: State) => void;

export type SVGElementsCreator = (element: Element) => SVGElement;

export const stateToSvg: StateToSvg = (svgContainer: SVGElement, svgElementsCreator: SVGElementsCreator) => {
  const elementsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  svgContainer.appendChild(elementsGroup);
  return (state: State) => {
    const getDomElements = (element: Element): SVGElement[] => {
      if (!element.children) {
        return [svgElementsCreator(element)];
      }
      return element.children.reduce(
        (elements: SVGElement[], element) => [...elements, ...getDomElements(element)],
        []);
    }

    const domElements = state.elements.map(getDomElements).reduce(
      (elements: SVGElement[], element) => [...elements, ...element], []
    );
    const elementsGroupInnerHTML = domElements.reduce(
      (innerHTML, element) => innerHTML += element.outerHTML,
      ''
    );
    elementsGroup.innerHTML = elementsGroupInnerHTML;
  };
};

type CombineSVGElementCreators = {
  [key in ElementType]: SVGElementsCreator;
};

export const combineSVGElementCreators = (props: CombineSVGElementCreators): SVGElementsCreator =>
  (element: Element) => {
    if (!props[element.type]) {
      throw new Error(`Unknown element type: ${element.type}`);
    }
    return props[element.type](element);
  };
