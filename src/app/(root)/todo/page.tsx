'use client';

import React, { useContext, useState } from 'react';
import { Reorder, motion } from 'framer-motion';
import Course from './Course';
import './page.css';
import Scrollable from '@/components/Scrollable';
import { CoursesContext } from '@/providers/CoursesContext';
import { modals } from '@mantine/modals';

const Page: React.FC = () => {
	const { courses, setCourses } = useContext(CoursesContext);
	const [reOrdering, setReOrdering] = useState<boolean>(false);
	const [editing, setEditing] = useState<boolean>(false);

	const updateCourses = (input: Course[]) => {
		const updated: Course[] = input;

		for (let i = 0; i < input.length; i++) {
			updated[i].period = i + 1;
		}

		setCourses(updated);
	};

	const handleAddCourse = () => {
		modals.open({
			title: 'Editing Course',
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
								period: courses.length,
								id: courses.length - 1,
								todo: [],
							}
						])

						modals.closeAll();
					}}>
					<input className='input' placeholder='Your new course name...' defaultValue={course.name} name='course' />
					<input className='input' placeholder='Your new course name...' defaultValue={course.name} name='course' />
					<button className='btn' type='submit'>
						Okay
					</button>
				</form>
			),
		});
	}

	return (
		<Scrollable className='full courses flex-col flex-gap'>
			<div className='flex-gap flex-align flex-space'>
				<h2>Courses</h2>
				<div className='flex-gap'>
					<button className={icon} onClick={handleAddCourse}>
						<svg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 -960 960 960' width='24px'>
							<path d='M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z' />
						</svg>
					</button>
					<button disabled={reOrdering} className={`icon${reOrdering ? ' disabled' : ''}`} onClick={() => setEditing((prev) => !prev)}>
						<svg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 -960 960 960' width='24px'>
							<path d='M600-240v-80h160v80H600Zm0-320v-80h280v80H600Zm0 160v-80h240v80H600ZM120-640H80v-80h160v-60h160v60h160v80h-40v360q0 33-23.5 56.5T440-200H200q-33 0-56.5-23.5T120-280v-360Z' />
						</svg>
					</button>
					<button disabled={editing} className={`icon${editing ? ' disabled' : ''}`} onClick={() => setReOrdering((prev) => !prev)}>
						<svg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 -960 960 960' width='24px'>
							<path d='M160-501q0 71 47.5 122T326-322l-62-62 56-56 160 160-160 160-56-56 64-64q-105-6-176.5-81T80-500q0-109 75.5-184.5T340-760h140v80H340q-75 0-127.5 52T160-501Zm400 261v-80h320v80H560Zm0-220v-80h320v80H560Zm0-220v-80h320v80H560Z' />
						</svg>
					</button>
				</div>
			</div>

			{courses.length < 1 ? (
				<div className='full center'>
					<div className='flex-align flex-col flex-gap'>
						<p>We didn&apos;t find any courses, would you like to add one?</p>
						<button className='btn'>Add</button>
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
								return <Course editing={editing} key={course.id} course={course} />;
							})}
						</div>
					)}
				</>
			)}
		</Scrollable>
	);
};

export default Page;
