'use server';
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from '@/lib/actions/shared.types';
import { connectToDatabase } from '@/lib/mongoose';
import User from '@/database/user. model';
import Tag, { ITag } from '@/database/tag.model';
import { FilterQuery } from 'mongoose';
import Question from '@/database/question.model';

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
  try {
    await connectToDatabase();
    const { userId } = params;
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    //   Find interactions for the user and group by tags...
    //   TODO: Interaction...
    return [
      { _id: '1', name: 'tag1' },
      { _id: '2', name: 'tag2' },
      { _id: '3', name: 'tag3' },
    ];
  } catch (error) {
    console.error(`❌ ${error} ❌`);
    throw error;
  }
}

export async function getAllTags(params: GetAllTagsParams) {
  try {
    await connectToDatabase();
    const { searchQuery, filter, page = 1, pageSize = 10 } = params;
    // Calculate the no. of tags to skip
    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof Tag> = {};
    let sortOptions = {};

    switch (filter) {
      case 'popular':
        sortOptions = { questionCount: -1 }; // Sort based on the size of the questions array
        break;
      case 'recent':
        sortOptions = { createdOn: -1 };
        break;
      case 'name':
        sortOptions = { name: 1 };
        break;
      case 'old':
        sortOptions = { createdOn: 1 };
        break;
      default:
        sortOptions = { createdOn: -1 }; // Add a default sort option
    }

    if (searchQuery) {
      query.$or = [{ name: { $regex: new RegExp(searchQuery, 'i') } }];
    }

    const tags = await Tag.aggregate([
      { $match: query },
      { $addFields: { questionCount: { $size: '$questions' } } }, // Add a field representing the size of the questions array
      { $sort: sortOptions },
      { $skip: skipAmount },
      { $limit: pageSize },
    ]);

    const totalTags = await Tag.countDocuments(query);
    const isNext = totalTags > skipAmount + tags.length;

    return { tags, isNext };
  } catch (error) {
    console.error(`❌ ${error} ❌`);
    throw error;
  }
}

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
  try {
    await connectToDatabase();
    // eslint-disable-next-line no-unused-vars
    const { tagId, searchQuery, page = 1, pageSize = 2 } = params;
    // for Pagination => caluclate the number of posts to skip based on the pageNumber and pageSize
    const skipAmount = (page - 1) * pageSize;
    const tagFilter: FilterQuery<ITag> = { _id: tagId };
    const tag = await Tag.findOne(tagFilter).populate({
      path: 'questions',
      model: Question,
      match: searchQuery
        ? { title: { $regex: searchQuery, $options: 'i' } }
        : {},
      options: {
        sort: { createdAt: -1 },
        skip: skipAmount,
        limit: pageSize, // +1 to check if there is next page FIXME: doesn't work correctly
      },
      populate: [
        { path: 'tags', model: Tag, select: '_id name' },
        { path: 'author', model: User, select: '_id clerkId name picture' },
      ],
    });
    if (!tag) {
      throw new Error('❌🔍 Tag not found 🔍❌');
    }
    const isNext = tag.questions.length >= pageSize;
    const questions = tag.questions;

    return { tagTitle: tag.name, questions, isNext };
  } catch (error) {
    console.error(`❌ ${error} ❌`);
  }
}

export async function getTopPopularTags() {
  try {
    await connectToDatabase();
    const popularTags = await Tag.aggregate([
      { $project: { name: 1, numberOfQuestions: { $size: '$questions' } } },
      { $sort: { numberOfQuestions: -1 } }, // descending order
      { $limit: 5 },
    ]);
    return popularTags;
  } catch (error) {
    console.error(`❌ ${error} ❌`);
  }
}
