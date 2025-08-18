export interface Activity {
  id: string;
  title: string;
  summary: string;
  type: string;
  instructor: string;
}

export interface Lesson {
  id: string;
  week: string;
  software?: Activity;
  hardware?: Activity;
  unified?: Activity;
}

export interface Unit {
  id: string;
  title: string;
  duration: string;
  goal: string;
  lessons: Lesson[];
}
const curriculumData: Unit[] = [
  {
    id: 'unit1',
    title: 'Coming soon!',
    duration: 'Coming soon!',
    goal: 'Coming soon!',
    lessons: [
      {
        id: 'unit1-week1-2',
        week: '1-2',
        software: {
          id: 'unit1-week1-2-software',
          title: 'Coming soon!',
          summary: 'Coming soon!',
          type: 'Software',
          instructor: 'TBD',
        },
        hardware: {
          id: 'unit1-week1-2-hardware',
          title: 'Coming soon!',
          summary: 'Coming soon!',
          type: 'Hardware',
          instructor: 'TBD',
        },
      },
    ],
  },
];

export default curriculumData;