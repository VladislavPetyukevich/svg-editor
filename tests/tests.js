var svgEl = document.createElement('svg');
svgEl.setAttribute('width', 400);
svgEl.setAttribute('height', 400);
var props = {
	svg: svgEl,
};
var editor = new SvgEditor(props);

QUnit.test("Rect transformations", function (assert) {
	var rect = editor.factory.rect({ x: 20, y: 40, width: 80, height: 20, fill: '#0000FF' });
	editor.add(rect);

	assert.deepEqual(rect.getPosition(), { x: 20, y: 40 }, 'Correctly position at initialization');
	assert.deepEqual(rect.getSize(), { width: 80, height: 20 }, 'Correctly size at initialization');

	rect.setPosition(40, 80);
	assert.deepEqual(rect.getPosition(), { x: 40, y: 80 }, 'Correctly changes position');
	rect.setSize(100, 40);
	assert.deepEqual(rect.getSize(), { width: 100, height: 40 }, 'Correctly changes size');
});

QUnit.test("Ellipse transformations", function (assert) {
	var ellipse = editor.factory.ellipse({ x: 20, y: 40, width: 80, height: 20, fill: '#0000FF' });
	editor.add(ellipse);

	assert.deepEqual(ellipse.getPosition(), { x: 20, y: 40 }, 'Correctly position at initialization');
	assert.deepEqual(ellipse.getSize(), { width: 80, height: 20 }, 'Correctly size at initialization');

	ellipse.setPosition(40, 80);
	assert.deepEqual(ellipse.getPosition(), { x: 40, y: 80 }, 'Correctly changes position');
	ellipse.setSize(100, 40);
	assert.deepEqual(ellipse.getSize(), { width: 100, height: 40 }, 'Correctly changes size');
});

QUnit.test("Triangle path transformations", function (assert) {
	var path = editor.factory.path({ x: 20, y: 40, width: 80, height: 20, d: 'M0,40 L20,0 L40,40 Z', fill: '#0000FF' });
	editor.add(path);

	assert.deepEqual(path.getPosition(), { x: 20, y: 40 }, 'Correctly position at initialization');
	assert.deepEqual(path.getSize(), { width: 80, height: 20 }, 'Correctly size at initialization');

	path.setPosition(40, 80);
	assert.deepEqual(path.getPosition(), { x: 40, y: 80 }, 'Correctly changes position');
	path.setSize(100, 40);
	assert.deepEqual(path.getSize(), { width: 100, height: 40 }, 'Correctly changes size');
});