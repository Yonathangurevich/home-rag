export class TagModel {
    
    public id: number;
    public name: string;

    public constructor(tag: TagModel) {
        this.id = tag.id;
        this.name = tag.name;
    }

}