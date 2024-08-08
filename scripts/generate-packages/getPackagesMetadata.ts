import { getPackagesMetadataForRollup } from '../../rollup.config';
import { findAllProjectEntities } from '../utils/findAllProjectEntities';
import type { PackageMetadata } from './PackageMetadata';

/**
 * Gets metadata of all packages of Promptbook ecosystem
 *
 * There are 2 simmilar functions:
 * - `getPackagesMetadata` Async version with declared types and extended information, use this in scripts
 * - `getPackagesMetadataForRollup` - Sync version with less information, use this ONLY in rollup config
 */
export async function getPackagesMetadata(): Promise<Array<PackageMetadata>> {
    const packagesMetadata = getPackagesMetadataForRollup() as Array<PackageMetadata>;
    const entities = await findAllProjectEntities();

    for (const packageMetadata of packagesMetadata) {
        const { packageFullname } = packageMetadata;
        packageMetadata.entities = [];

        for (const entity of entities) {
            const { anotation } = entity;

            // TODO: !!!!!!! Use isType
            // TODO: !!!!!!! Use @private

            if (!(anotation || '').includes(packageFullname)) {
                continue;
            }

            packageMetadata.entities.push(entity);
        }
    }

    return packagesMetadata;
}

/**
 * Note: [🧃] Packages `@promptbook/cli` and `@promptbook/types` are marked as dependencies (not devDependencies) to ensure that they are always installed
 */
