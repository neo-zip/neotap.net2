'use client';

import React, { useContext, useState } from 'react';
import { Reorder, motion } from 'framer-motion';
import Course from './Course';
import './page.css';
import Scrollable from '@/components/Scrollable';
import { CoursesContext } from '@/providers/CoursesContext';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { Tooltip } from '@mantine/core';

const Page: React.FC = () => {
	const { courses, setCourses } = useContext(CoursesContext);
	const [reOrdering, setReOrdering] = useState<boolean>(false);

	const updateCourses = (input: Course[]) => {
		const updated: Course[] = input;

		for (let i = 0; i < input.length; i++) {
			updated[i].period = i + 1;
		}

		setCourses(updated);
	};

	const handleAddCourse = () => {
		modals.open({
			title: 'Adding Course',
			children: (
				<form
					className='flex-col'
					action={(query: any) => {
						const input = query.get('course');

						if (input.length < 1 || input.length > 100) {
							notifications.show({ title: 'Sorry!', message: 'Please provide course name. (1-100 letters)' });
							return;
						}

						setCourses([
							...courses,
							{
								name: input,
								period: courses.length + 1,
								id: courses.length + 1,
								todo: [],
							},
						]);

						modals.closeAll();
					}}>
					<input className='input' placeholder='Course name...' name='course' />
					<button className='btn' type='submit'>
						Okay
					</button>
				</form>
			),
		});
	};

	return (
		<Scrollable className='full courses flex-col flex-gap'>
			<div className='flex-gap flex-align flex-space'>
				<h2>Courses</h2>
				<div className='flex-gap'>
					<Tooltip label='Add Course'>
						<button className='icon' onClick={handleAddCourse}>
							<svg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 -960 960 960' width='24px'>
								<path d='M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z' />
							</svg>
						</button>
					</Tooltip>
					{reOrdering ? (
						<Tooltip label='Done'>
							<button className='icon' onClick={() => setReOrdering((prev) => !prev)}>
								<svg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 -960 960 960' width='24px'>
									<path d='M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z' />
								</svg>
							</button>
						</Tooltip>
					) : (
						<Tooltip label='Reorder Courses'>
							<button className='icon' onClick={() => setReOrdering((prev) => !prev)}>
								<svg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 -960 960 960' width='24px'>
									<path d='M160-501q0 71 47.5 122T326-322l-62-62 56-56 160 160-160 160-56-56 64-64q-105-6-176.5-81T80-500q0-109 75.5-184.5T340-760h140v80H340q-75 0-127.5 52T160-501Zm400 261v-80h320v80H560Zm0-220v-80h320v80H560Zm0-220v-80h320v80H560Z' />
								</svg>
							</button>
						</Tooltip>
					)}
				</div>
			</div>

			{courses.length < 1 ? (
				<div className='full center'>
					<div className='flex-align flex-col flex-gap'>
						<p>We didn&apos;t find any courses, would you like to add one?</p>
						<button className='btn' onClick={handleAddCourse}>
							Add
						</button>
					</div>
				</div>
			) : (
				<>
					{reOrdering ? (
						<motion.div initial={{ scale: 1 }} animate={{ scale: 0.9 }} exit={{ scale: 1 }} layout='preserve-aspect'>
							<Reorder.Group
								values={courses}
								onReorder={updateCourses}
								className={`actual${reOrdering ? ' reordering' : ''}`}>
								{courses.map((course: Course) => {
									return (
										<Reorder.Item value={course} key={course.id}>
											<Course course={course} />
										</Reorder.Item>
									);
								})}
							</Reorder.Group>
						</motion.div>
					) : (
						<div className='actual'>
							{courses.map((course: Course) => {
								return <Course key={course.id} course={course} />;
							})}
						</div>
					)}
				</>
			)}
		</Scrollable>
	);
};

export default Page;
