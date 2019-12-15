import { expect } from 'chai';
import { spy } from 'sinon';
import { combineSVGElementCreators, stateToSvg } from '../src/SVG/StateToSvg';

describe('CombineSVGElementCreators', () => {
  const resultDomElement = { test: 'test' };
  const svgElementCreators = {
    someType: () => (resultDomElement),
  };
  const stateToSvgMapper = combineSVGElementCreators(svgElementCreators as any);
  const document = {};

  it('should throw unknown type exception', () => {
    const element = {
      type: 'some test type'
    };
    expect(
      () => stateToSvgMapper(document as any, element as any)
    ).throw('Unknown element type: some test type');
  });

  it('should return dom element', () => {
    const document = {};
    const element = {
      type: 'someType'
    };
    const result = stateToSvgMapper(document as any, element as any)
    expect(result).deep.equal(resultDomElement);
  });
});

describe('StateToSvg', () => {
  const groupDomElement = { innerHTML: 'group test innerHTML', appendChild: spy() };
  const someDomElement = { outerHTML: 'test outerHTML', appendChild: spy() };
  const someChildDomElement = { innerHTML: 'test child innerHTML' };
  const svgElementCreators = {
    someType: () => someDomElement,
    someChildType: () => someChildDomElement
  };
  const stateToSvgMapper = combineSVGElementCreators(svgElementCreators as any);
  const document = {
    createElementNS: spy(() => groupDomElement)
  };
  const svgContainer = {
    appendChild: spy(),
    removeChild: spy()
  };
  const state = {
    elements: [{ type: 'someType', children: [{ id: 0, type: 'someChildType' }] }]
  };

  beforeEach(() => {
    document.createElementNS.resetHistory();
    svgContainer.appendChild.resetHistory();
    someDomElement.appendChild.resetHistory();
    groupDomElement.appendChild.resetHistory();
    svgContainer.removeChild.resetHistory();
  });

  it('should create group element', () => {
    stateToSvg(document as any, svgContainer as any, stateToSvgMapper as any);
    const createElementArgs = document.createElementNS.getCalls().map(call => call.args);
    const expectedCreateElementArgs = [['http://www.w3.org/2000/svg', 'g']];
    expect(expectedCreateElementArgs).deep.equal(createElementArgs);
    const appendChildArgs = svgContainer.appendChild.getCalls().map(call => call.args);
    const expectedAppendChildArgs = [[groupDomElement]];
    expect(expectedAppendChildArgs).deep.equal(appendChildArgs);
  });

  it('should append child to parent element', () => {
    stateToSvg(document as any, svgContainer as any, stateToSvgMapper as any)(state as any);
    const appendChildArgs = someDomElement.appendChild.getCalls().map(call => call.args);
    const expectedAppendChildArgs = [[someChildDomElement]];
    expect(expectedAppendChildArgs).deep.equal(appendChildArgs);
  });

  it('should create new group element', () => {
    stateToSvg(document as any, svgContainer as any, stateToSvgMapper as any)(state as any);
    const createElementArgs = document.createElementNS.getCalls().map(call => call.args);
    const expectedCreateElementArgs = [["http://www.w3.org/2000/svg", "g"], ["http://www.w3.org/2000/svg", "g"]];
    expect(createElementArgs).deep.equal(expectedCreateElementArgs);
    const appendChildArgs = groupDomElement.appendChild.getCalls().map(call => call.args);
    const expectedAppendChildArgs = [[someDomElement]];
    expect(appendChildArgs).deep.equal(expectedAppendChildArgs);
  });

  it('should replace old group element with new', () => {
    stateToSvg(document as any, svgContainer as any, stateToSvgMapper as any)(state as any);
    const removeChildArgs = svgContainer.removeChild.getCalls().map(call => call.args);
    const expectedRemoveChildArgs = [[groupDomElement]]
    expect(removeChildArgs).deep.equal(expectedRemoveChildArgs);
    const appendChildArgs = svgContainer.appendChild.getCalls().map(call => call.args);
    const expectedAppendChildArgs = [[groupDomElement], [groupDomElement]];
    expect(appendChildArgs).deep.equal(expectedAppendChildArgs);
  });
});
