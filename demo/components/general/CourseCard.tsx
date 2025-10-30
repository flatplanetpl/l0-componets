import { Star, Users } from 'lucide-react';

interface Course {
  id: number;
  title: string;
  instructor: string;
  rating: number;
  students: number;
  category: string;
  price: number;
}

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  return (
    <div className="bg-card rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="bg-muted border-2 border-dashed w-full h-48" />
      <div className="p-6">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {course.category}
          </span>
          <div className="flex items-center">
            <Star className="h-5 w-5 text-yellow-400" fill="currentColor" />
            <span className="ml-1 text-sm font-medium text-foreground">{course.rating}</span>
          </div>
        </div>
        <h3 className="mt-4 text-lg font-medium text-foreground">{course.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">by {course.instructor}</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="h-4 w-4 mr-1" />
            <span>{course.students.toLocaleString()} students</span>
          </div>
          <span className="text-lg font-bold text-foreground">${course.price}</span>
        </div>
        <div className="mt-6">
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200">
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;