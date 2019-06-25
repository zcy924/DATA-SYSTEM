import { ExplicitRegion } from '../core/region/explicit/explicit.region';
import { CommentRegion } from '../core/region/comment/comment.region';

export const regionDefinitionMap = new Map();
regionDefinitionMap.set('explicit.region', ExplicitRegion);
regionDefinitionMap.set('comment.region', CommentRegion);
