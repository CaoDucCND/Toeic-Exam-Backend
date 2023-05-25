import { Inject, Injectable } from "@nestjs/common";
import { Blog } from "src/entities/Blog";
import { Repository } from "typeorm";

@Injectable()
export class BlogService {
    constructor(
        @Inject('BLOG_REPOSITORY') private blogRepository: Repository<Blog>) { }

    async findAll(): Promise<Blog[]> {
        return await this.blogRepository.find()
    }
    async findOne(id: number): Promise<Blog> {
        return await this.blogRepository.findOne({ where: { id: id } })
    }
    async create(blog: Blog): Promise<Blog> {
        return await this.blogRepository.save(blog)
    }
}
