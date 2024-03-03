'use client';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { AnswerSchema } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { Editor } from '@tinymce/tinymce-react';
import React, { useRef, useState } from 'react';
import { useTheme } from '@/context/ThemeProvider';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const Answer = () => {
  // fetch mode then modify editor mode accordingly
  const { mode } = useTheme();
  // eslint-disable-next-line no-unused-vars
  const [isSubmitting, setIsSubmitting] = useState(false);
  const editorRef = useRef(null);
  const answerForm = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      answer: '',
    },
  });

  const handleCreateAnswer = () => {};
  return (
    <>
      <div className='flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2'>
        <h4 className='paragraph-semibold text-dark400_light800'>
          Write your answer here
        </h4>
        <Button
          className='btn light-border-2 gap-1.5 rounded-md px-4 py-2.5 text-primary-500 shadow-none dark:text-primary-500'
          onClick={() => {}}
        >
          <Image
            src='/assets/icons/stars.svg'
            alt='star'
            width={12}
            height={12}
            className='object-contain'
          />
          Generate an AI answer
        </Button>
      </div>
      <Form {...answerForm}>
        <form
          className='mt-6 flex w-full flex-col gap-10'
          onSubmit={answerForm.handleSubmit(handleCreateAnswer)}
        >
          <FormField
            control={answerForm.control}
            name='answer'
            render={({ field }) => (
              <FormItem className='flex w-full flex-col gap-3'>
                <FormControl className='mt-3.5'>
                  {/* START OF Editor Component */}
                  <Editor
                    apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                    onInit={(evt, editor) =>
                      // @ts-ignore
                      (editorRef.current = editor)
                    }
                    onBlur={field.onBlur}
                    onEditorChange={(content) => field.onChange(content)}
                    init={{
                      height: 350,
                      menubar: false,
                      plugins: [
                        'advlist',
                        'autolink',
                        'lists',
                        'link',
                        'image',
                        'charmap',
                        'preview',
                        'anchor',
                        'searchreplace',
                        'visualblocks',
                        'codesample',
                        'fullscreen',
                        'insertdatetime',
                        'media',
                        'table',
                      ],
                      toolbar:
                        'undo redo |  | ' +
                        'codesample | bold italic forecolor | alignleft aligncenter' +
                        'alignright alignjustify | bullist numlist ',
                      content_style:
                        'body { font-family:Inter; font-size:16px }',
                      skin: mode === 'dark' ? 'oxide-dark' : 'oxide',
                      content_css: mode === 'dark' ? 'dark' : 'light',
                    }}
                  />
                  {/* END OF Editor Component */}
                </FormControl>
                <FormMessage className='text-red-500' />
              </FormItem>
            )}
          />
        </form>

        {/* Submit Button */}
        <div className='mt-3 flex justify-end'>
          <Button
            type='button'
            className='primary-gradient w-fit text-white'
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </Form>
    </>
  );
};

export default Answer;