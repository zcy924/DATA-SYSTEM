import { ExplicitRegion } from './explicit/explicit.region';
import { CommentRegion } from './comment/comment.region';

export const regionDefinitionMap = new Map();
regionDefinitionMap.set('explicit.region', ExplicitRegion);
regionDefinitionMap.set('comment.region', CommentRegion);
