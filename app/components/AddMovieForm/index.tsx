import {
  AlertDialogAction,
  AlertDialogCancel,
} from '@components/shadcn/alert-dialog';

import { addMovie } from '@lib/api';
import { Category } from '@lib/definitions';
import { useActionState, useEffect, useRef, useState } from 'react';

const AddMovieForm = ({
  categories,
  setFeedback,
}: {
  categories: Category[];
  setFeedback: (message: string) => void;
}) => {
  const [state, action, pending] = useActionState(addMovie, undefined);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showCategories, setShowCategories] = useState<boolean>(false);

  const [title, setTitle] = useState<string>('');
  const [pubDate, setPubDate] = useState<number | ''>('');
  const [duration, setDuration] = useState<number | ''>('');
  const [rating, setRating] = useState<number | ''>('');
  const [description, setDescription] = useState<string | ''>('');

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;

    setSelectedCategories(
      checked
        ? [...selectedCategories, value]
        : selectedCategories.filter((category) => category !== value),
    );
  };

  const categoriesRef = useRef<HTMLDivElement | null>(null);
  const closeDialogRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoriesRef.current &&
        !categoriesRef.current.contains(event.target as Node)
      ) {
        setShowCategories(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
  }, [categoriesRef]);

  // Reset error message
  useEffect(() => {
    if (state?.message) {
      setFeedback(state?.message);
      closeDialogRef.current?.click();
    } else setFeedback('');
  }, [state, setFeedback]);

  return (
    <form
      noValidate
      action={action}
      id="add-movie"
      name="add-movie"
      className="mx-auto mt-5 flex w-4/5 flex-col gap-4 text-sm"
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="title" className="text-sm font-semibold">
          Title
        </label>
        <input
          type="text"
          placeholder="e.g. The Matrix"
          name="title"
          className="focus:border-primary focus:outline-primary rounded-md border border-white px-3 py-2 focus:outline-1"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {state?.errors?.title && (
          <span className="px-2 pt-1 text-xs text-red-500">
            {state.errors.title}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="pub_date" className="text-sm font-semibold">
          Publication Date
        </label>
        <input
          type="text"
          placeholder="e.g. 1999"
          name="pub_date"
          className="focus:border-primary focus:outline-primary rounded-md border border-white px-3 py-2 focus:outline-1"
          value={pubDate}
          onChange={(e) => setPubDate(Number(e.target.value) || '')}
        />
        {state?.errors?.pub_date && (
          <span className="px-2 pt-1 text-xs text-red-500">
            {state.errors.pub_date}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="duration" className="text-sm font-semibold">
          Duration
        </label>
        <input
          type="text"
          placeholder="e.g. 136"
          name="duration"
          className="focus:border-primary focus:outline-primary rounded-md border border-white px-3 py-2 focus:outline-1"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value) || '')}
        />
        {state?.errors?.duration && (
          <span className="px-2 pt-1 text-xs text-red-500">
            {state.errors.duration}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="rating" className="text-sm font-semibold">
          Rating
        </label>
        <input
          type="text"
          placeholder="10"
          name="rating"
          className="focus:border-primary focus:outline-primary rounded-md border border-white px-3 py-2 focus:outline-1"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value) || '')}
        />
        {state?.errors?.rating && (
          <span className="px-2 pt-1 text-xs text-red-500">
            {state.errors.rating}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="text-sm font-semibold">
          Description
        </label>
        <input
          type="textarea"
          placeholder="Maybe the blue pill next time..."
          name="description"
          className="focus:border-primary focus:outline-primary rounded-md border border-white px-3 py-2 focus:outline-1"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {state?.errors?.description && (
          <span className="px-2 pt-1 text-xs text-red-500">
            {state.errors.description}
          </span>
        )}
      </div>

      <div className="relative my-5 flex flex-col items-start gap-4">
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setShowCategories(true)}
            className="text-md focus:border-primary focus:outline-primary rounded-full border border-white px-5 py-2 font-semibold focus:outline-1"
          >
            Select Categories
          </button>
          {state?.errors?.categories && (
            <span className="px-2 pt-1 text-xs text-red-500">
              {state.errors.categories}
            </span>
          )}
        </div>

        <div
          className={`${selectedCategories.length > 0 ? 'visible' : 'invisible'} flex flex-col gap-2`}
        >
          <p className="font-semibold underline underline-offset-4">
            Selected Categories
          </p>
          <p className="block overflow-hidden overflow-ellipsis">
            {selectedCategories.join(', ')}
          </p>
        </div>

        <div
          ref={categoriesRef}
          className={`${showCategories ? 'block' : 'hidden'} bg-secondary absolute top-20 right-0 flex h-[50vh] w-52 -translate-y-100 flex-col gap-3 overflow-y-scroll rounded-lg border border-white p-4`}
        >
          {categories?.map((category: Category) => (
            <label
              key={category.name}
              htmlFor={category.name}
              className="flex items-center gap-2"
            >
              <input
                type="checkbox"
                id={category.name}
                value={category.name}
                name="category"
                className="text-white"
                onChange={handleCategoryChange}
              />
              {category.name}
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end gap-5">
        <AlertDialogCancel className="h-10">Cancel</AlertDialogCancel>
        <button
          disabled={pending}
          className="border-primary hover:bg-primary h-10 rounded-md border-2 bg-transparent px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 ease-in-out disabled:bg-slate-300"
        >
          Add
        </button>
      </div>

      <AlertDialogAction
        ref={closeDialogRef}
        className="invisible h-0 w-0 p-0"
      ></AlertDialogAction>
    </form>
  );
};

export default AddMovieForm;
