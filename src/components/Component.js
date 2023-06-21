import React, { useRef, useState } from 'react';
import Moveable from 'react-moveable';

export const Component = ({
	updateMoveable,
	top,
	left,
	width,
	height,
	index,
	color,
	id,
	setSelected,
	isSelected = false,
	updateEnd,
	fit,
	image,
	moveableComponents,
	setMoveableComponents,
}) => {
	const ref = useRef();

	const [nodoReferencia, setNodoReferencia] = useState({
		top,
		left,
		width,
		height,
		index,
		color,
		image,
		id,
	});

	const deleteC = () => {
		const newArr = moveableComponents.filter((res) => res.id !== id);
		setMoveableComponents(newArr);
	};

	let parent = document.getElementById('parent');
	let parentBounds = parent?.getBoundingClientRect();

	const onResize = async (e) => {
		// ACTUALIZAR ALTO Y ANCHO
		let newWidth = e.width;
		let newHeight = e.height;

		const positionMaxTop = top + newHeight;
		const positionMaxLeft = left + newWidth;

		if (positionMaxTop > parentBounds?.height)
			newHeight = parentBounds?.height - top;
		if (positionMaxLeft > parentBounds?.width)
			newWidth = parentBounds?.width - left;

		updateMoveable(id, {
			top,
			left,
			width: newWidth,
			height: newHeight,
			color,
			image,
		});

		// ACTUALIZAR NODO REFERENCIA
		const beforeTranslate = e.drag.beforeTranslate;

		ref.current.style.width = `${e.width}px`;
		ref.current.style.height = `${e.height}px`;

		let translateX = beforeTranslate[0];
		let translateY = beforeTranslate[1];

		ref.current.style.transform = `translate(${translateX}px, ${translateY}px)`;

		setNodoReferencia({
			...nodoReferencia,
			translateX,
			translateY,
			top: top + translateY < 0 ? 0 : top + translateY,
			left: left + translateX < 0 ? 0 : left + translateX,
		});
	};

	const onResizeEnd = async (e) => {
		let newWidth = e.lastEvent?.width;
		let newHeight = e.lastEvent?.height;

		const positionMaxTop = top + newHeight;
		const positionMaxLeft = left + newWidth;

		if (positionMaxTop > parentBounds?.height)
			newHeight = parentBounds?.height - top;
		if (positionMaxLeft > parentBounds?.width)
			newWidth = parentBounds?.width - left;

		const { lastEvent } = e;
		const { drag } = lastEvent;
		const { beforeTranslate } = drag;

		const absoluteTop = top + beforeTranslate[1];
		const absoluteLeft = left + beforeTranslate[0];

		updateMoveable(
			id,
			{
				top: absoluteTop,
				left: absoluteLeft,
				width: newWidth,
				height: newHeight,
				color,
				image,
			},
			true,
		);
	};

	return (
		<>
			<div
				ref={ref}
				className="draggable"
				id={'component-' + id}
				style={{
					position: 'absolute',
					top: top,
					left: left,
					width: width,
					height: height,
					background: color,
					image,
					overflow: 'hidden',
				}}
				onClick={() => setSelected(id)}
			>
				<button
					onClick={deleteC}
					style={{
						position: 'fixed',
					}}
				>
					Delete
				</button>
				<img
					src={image}
					alt="Component"
					style={{
						width: '100%',
						height: '100%',
						objectFit: fit,
					}}
				/>
			</div>

			<Moveable
				target={isSelected && ref.current}
				resizable
				draggable
				onDrag={(e) => {
					const { top, left, width, height } = e;
					const parentBounds = parent?.getBoundingClientRect();

					const maxTop = parentBounds?.height - height;
					const maxLeft = parentBounds?.width - width;

					const restrictedTop = Math.max(0, Math.min(top, maxTop));
					const restrictedLeft = Math.max(0, Math.min(left, maxLeft));

					updateMoveable(id, {
						top: restrictedTop,
						left: restrictedLeft,
						width,
						height,
						color,
						image,
					});
				}}
				onResize={onResize}
				onResizeEnd={onResizeEnd}
				keepRatio={false}
				throttleResize={1}
				renderDirections={['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se']}
				edge={false}
				zoom={1}
				origin={false}
				padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
			/>
		</>
	);
};
