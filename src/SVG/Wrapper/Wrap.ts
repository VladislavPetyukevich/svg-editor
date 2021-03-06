import { SVGElementsCreator } from '../..//SVG/StateToSvg';
import { Element } from '../../Element';

export type Wrapper =
  (element: Element) => (domElement: SVGElement) => SVGElement;

export const wrap = (elementCreator: SVGElementsCreator, wrappers: Wrapper[]) =>
  (document: Document, element: Element): SVGElement =>
    wrappers.reduce(
      (domElement, wrapper) => wrapper(element)(domElement),
      elementCreator(document, element)
    );
